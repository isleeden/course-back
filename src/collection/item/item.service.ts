import { CreateItemDto } from './dto/create-item.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagService } from 'src/collection/tag/tag.service';
import { Item, ItemDocument } from './item.schema';
import { TagDocument } from '../tag/Tag.schema';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private item: Model<ItemDocument>,
    private tagService: TagService,
  ) {}

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
      const findedTag = await this.tagService.findOrCreate({ name: tag });
      await this.addTagToItem(findedTag, item._id);
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
}
