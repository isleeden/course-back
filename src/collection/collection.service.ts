import { FieldDocument } from '../field/field.schema';
import { FieldService } from '../field/field.service';
import { UsersService } from 'src/users/users.service';
import {
  CollectionField,
  CreateCollectionDto,
  EditCollectionDto,
} from './dto/create-collection.dto';
import { Injectable } from '@nestjs/common';
import { Collection, CollectionDocument } from './collection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPaginationData } from 'src/types/get-data.dto';
import { ItemDocument } from '../item/item.schema';
import { aggregateByLength, paginationQuery } from 'src/utils';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name) private collection: Model<CollectionDocument>,
    private userService: UsersService,
    private fieldService: FieldService,
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
      sortBy: -1,
      sortField: '$items',
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

  async update(id: string, collectionDto: EditCollectionDto) {
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

  async remove(id: string) {
    return await this.collection.findByIdAndDelete(id);
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
}
