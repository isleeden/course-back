import { FieldDocument } from './field/field.schema';
import { getByUserIdPaginationData } from '../types/get-data.dto';
import { FieldService } from './field/field.service';
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
import { ItemDocument } from './item/item.schema';

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
    const findQuery = this.collection.find().skip(query.offset);
    findQuery.limit(query.limit);
    const results = await findQuery.populate({
      path: 'items',
      populate: { path: 'tags' },
    });
    const count = await this.collection.count();
    return { results, count };
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

  async findByUserId(query: getByUserIdPaginationData) {
    const findQuery = this.collection
      .find({ user: query.user_id })
      .skip(query.offset);
    const results = await findQuery.limit(query.limit).populate('user');
    const count = await this.collection.count();
    return { results, count };
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
