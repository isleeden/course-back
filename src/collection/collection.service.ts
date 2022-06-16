import { TagDocument } from './../tag/Tag.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { Injectable } from '@nestjs/common';
import { Collection, CollectionDocument } from './schemas/collection.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getPaginationData } from 'src/types/get-pagination-data.dto';
import { ItemDocument, Item } from './schemas/item.schema';
import { TagService } from 'src/tag/tag.service';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name) private collection: Model<CollectionDocument>,
    @InjectModel(Item.name) private item: Model<ItemDocument>,
    private tagService: TagService,
  ) {}

  async createCollection(collectionDto: CreateCollectionDto) {
    const createdCollection = new this.collection(collectionDto);
    return await createdCollection.save();
  }

  async addItem(itemDto: CreateItemDto) {
    const createdItem = await this.item.create({
      name: itemDto.name,
      _collection: itemDto.collection_id,
    });
    await this.bindTags(itemDto.tags, createdItem);
    return this.item.findById(createdItem._id);
  }

  private async bindTags(tags: string[], item: ItemDocument) {
    for await (const tag of tags) {
      console.log(tag);
      const findedTag = await this.tagService.findOrCreate({ name: tag });
      console.log(findedTag);
      const tagg = await this.addTagToItem(findedTag, item._id);
      console.log(tagg);
      await this.tagService.addItemToTag(item, findedTag._id);
    }
  }

  private async addTagToItem(tag: TagDocument, item_id: string) {
    return await this.item.findByIdAndUpdate(
      item_id,
      { $push: { tags: tag._id } },
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
