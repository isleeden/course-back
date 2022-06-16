import { UsersService } from 'src/users/users.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Injectable } from '@nestjs/common';
import { Collection, CollectionDocument } from './collection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPaginationData } from 'src/types/get-pagination-data.dto';
import { ItemDocument } from './item/item.schema';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name) private collection: Model<CollectionDocument>,
    private userService: UsersService,
  ) {}

  async createCollection(collectionDto: CreateCollectionDto, request) {
    const userId = request.user.id;
    const createdCollection = await this.collection.create({...collectionDto, user: userId});
    await this.userService.findAndAddCollection(
      userId,
      createdCollection,
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
    const results = await findQuery.populate('items');
    const count = await this.collection.count();
    return { results, count };
  }
}
