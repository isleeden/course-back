import { AuthService } from './../auth/auth.service';
import { UserDocument } from './../users/users.schema';
import { FieldDocument } from '../field/field.schema';
import { FieldService } from '../field/field.service';
import { UsersService } from 'src/users/users.service';
import {
  CollectionField,
  CreateCollectionDto,
  EditCollectionDto,
} from './dto/create-collection.dto';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Collection, CollectionDocument } from './collection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPaginationData } from 'src/types/get-data.dto';
import { ItemDocument } from '../item/item.schema';
import { aggregateByLength, paginationQuery } from 'src/utils';
import { ItemService } from 'src/item/item.service';
import Roles from 'src/types/roles';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name) private collection: Model<CollectionDocument>,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @Inject(forwardRef(() => FieldService))
    private fieldService: FieldService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private itemService: ItemService,
  ) {}

  async createCollection(collectionDto: CreateCollectionDto, request) {
    const userId = request.user.id;
    const createdCollection = await this.collection.create({
      name: collectionDto.name,
      description: collectionDto.description,
      image: collectionDto.image,
      user: userId,
    });
    await this.userService.findAndAddCollection(userId, createdCollection);
    await this.addFieldsToCollection(
      createdCollection._id,
      collectionDto.fields,
    );
    return createdCollection;
  }

  async findAndAddItem(collectionId: string, item: ItemDocument) {
    return await this.collection.findByIdAndUpdate(
      collectionId,
      { $push: { items: item._id } },
      { new: true, useFindAndModify: false },
    );
  }

  async findAll(query: getPaginationData) {
    const { findQuery, count } = await paginationQuery<Collection>(
      this.collection,
      { query },
    );
    const results = await findQuery.populate([{ path: 'user' }]);
    return { results, count };
  }

  async findMostItems(query: getPaginationData) {
    const { results } = await aggregateByLength<Collection>(this.collection, {
      query,
      lengthField: '$items',
    });
    return await results
      .lookup({
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      })
      .unwind({ path: '$user', preserveNullAndEmptyArrays: true });
  }

  async update(id: string, collectionDto: EditCollectionDto, request) {
    const userId = request.user.id;
    await this.verify(userId, id);
    const createdCollection = await this.collection.findByIdAndUpdate(id, {
      name: collectionDto.name,
      description: collectionDto.description,
      fields: [],
      image: collectionDto.image,
    });
    await this.addFieldsToCollection(
      createdCollection._id,
      collectionDto.fields,
    );
    return createdCollection;
  }

  async findById(id: string) {
    return await this.collection
      .findById(id)
      .populate('fields')
      .populate('user');
  }

  async remove(id: string, request) {
    const userId = request.user.id;
    await this.verify(userId, id);
    const collection = await this.collection.findById(id);
    for (const item of collection.items as ItemDocument[]) {
      await this.itemService.remove(item._id);
    }
    this.fieldService.deleteMany({ collection: id });
    const user = collection.user as UserDocument;
    this.userService.unbindCollection(collection, user._id);
    return await collection.delete();
  }

  private async addFieldsToCollection(
    collectionId: string,
    fields: CollectionField[],
  ) {
    for (const field of fields) {
      const createdOrUpdated = field._id
        ? await this.updateField(field)
        : await this.createField(field, collectionId);
      await this.addFieldToCollection(createdOrUpdated, collectionId);
    }
  }

  private async addFieldToCollection(
    field: FieldDocument,
    collectionId: string,
  ) {
    await this.collection.findByIdAndUpdate(
      collectionId,
      { $push: { fields: field._id } },
      { new: true, useFindAndModify: false },
    );
  }

  private async createField(field: CollectionField, collectionId: string) {
    return await this.fieldService.create({
      collection_id: collectionId,
      type: field.type,
      name: field.name,
    });
  }

  private async updateField(field: CollectionField) {
    return await this.fieldService.update({
      id: field._id,
      type: field.type,
      name: field.name,
    });
  }

  async unbindItem(item: ItemDocument, collection_id: string) {
    return await this.collection.findByIdAndUpdate(
      collection_id,
      { $pull: { items: item._id } },
      { multi: true },
    );
  }

  async verify(user_id: string, collection_id: string) {
    if (await this.authService.verifyUser(user_id)) return true;
    const collection = await this.collection
      .findById(collection_id)
      .populate('user');
    const author = collection.user as UserDocument;
    if (author._id.toString() !== user_id) throw new ForbiddenException();
  }
}
