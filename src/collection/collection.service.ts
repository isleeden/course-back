import { CreateCollectionDto } from './dto/create-collection.dto';
import { Injectable } from '@nestjs/common';
import { Collection, CollectionDocument } from './collection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPaginationData } from 'src/types/get-pagination-data.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name) private collection: Model<CollectionDocument>,
  ) {}

  async createCollection(collectionDto: CreateCollectionDto) {
    const createdCollection = new this.collection(collectionDto);
    return await createdCollection.save();
  }

  async findAll(query: getPaginationData) {
    const findQuery = this.collection.find().skip(query.offset);
    findQuery.limit(query.limit);
    const results = await findQuery.populate('items');
    const count = await this.collection.count();
    return { results, count };
  }
}
