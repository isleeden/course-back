import { FieldValueService } from './../field-value/field-value.service';
import { CreateFieldValueDto } from './../field-value/dto/create-field-value.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TagService } from 'src/collection/tag/tag.service';
import { Item, ItemDocument } from './item.schema';
import { TagDocument } from '../tag/Tag.schema';
import { CollectionService } from '../collection.service';
import { FieldValueDocument } from '../field-value/field-value.schema';
import { RemoveTagDto } from './dto/remove-tag.dto';
import { getPaginationData } from 'src/types/get-data.dto';
import { paginationQuery } from 'src/utils';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private item: Model<ItemDocument>,
    private tagService: TagService,
    private collectionService: CollectionService,
    private fieldValueService: FieldValueService,
  ) {}

  async addItem(itemDto: CreateItemDto) {
    const createdItem = await this.item.create({
      name: itemDto.name,
      _collection: itemDto.collection_id,
    });
    await this.bindFieldValues(itemDto.fieldValues, createdItem);
    await this.bindTags(itemDto.tags, createdItem);
    await this.collectionService.findAndAddItem(
      itemDto.collection_id,
      createdItem,
    );
    return await this.item.findById(createdItem._id);
  }

  async update(id: string, itemDto: CreateItemDto) {
    const updatedItem = await this.item.findByIdAndUpdate(id, {
      name: itemDto.name,
      _collection: itemDto.collection_id,
      fields: [],
      tags: [],
    });
    await this.bindFieldValues(itemDto.fieldValues, updatedItem);
    await this.bindTags(itemDto.tags, updatedItem);
    return updatedItem;
  }

  async remove(id: string) {
    return await this.item.findByIdAndDelete(id);
  }

  async findById(id: string) {
    return await this.item.findById(id);
  }

  async addValue(itemId: string, fieldValue: FieldValueDocument) {
    return await this.item.findByIdAndUpdate(
      itemId,
      { $push: { fieldValues: fieldValue._id } },
      { new: true, useFindAndModify: false },
    );
  }

  async removeTag(removeTagDto: RemoveTagDto) {
    return await this.item.findByIdAndUpdate(removeTagDto.id, {
      $pull: { tags: removeTagDto.tag_id },
    });
  }

  async addTagToItem(tag: TagDocument, item: ItemDocument) {
    return await this.item.findByIdAndUpdate(
      item._id,
      { $push: { tags: tag._id } },
      { new: true, useFindAndModify: false },
    );
  }

  async findCollectionItems(id: string, query: getPaginationData) {
    const { findQuery, count } = await paginationQuery<Item>(this.item, {
      where: { _collection: id },
      query,
    });
    const results = await findQuery.populate('fieldValues').populate('tags');
    return { results, count };
  }

  async findItem(id: string) {
    return await this.item
      .findById(id)
      .populate('fieldValues')
      .populate('tags')
      .populate({
        path: '_collection',
        populate: [{ path: 'fields' }, { path: 'user' }],
      });
  }

  private async bindFieldValues(
    fieldValues: CreateFieldValueDto[],
    item: ItemDocument,
  ) {
    for (const value of fieldValues) {
      await this.fieldValueService.addField(value, item._id);
    }
  }

  private async bindTags(tags: string[], item: ItemDocument) {
    const uniqueTags = this.getUniqueTags(tags);
    for (const tag of uniqueTags) {
      const findedTag = await this.tagService.findOrCreate({ name: tag });
      await this.addTagToItem(findedTag, item);
      await this.tagService.addItemToTag(item, findedTag._id);
    }
  }

  private getUniqueTags(tags: string[]) {
    const uniqueTags = [];
    tags.forEach((element) => {
      if (!uniqueTags.includes(element)) {
        uniqueTags.push(element.trim());
      }
    });
    return uniqueTags;
  }
}
