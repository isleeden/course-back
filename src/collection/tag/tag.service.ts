import { aggregateByLength, paginationQuery } from 'src/utils';
import { getPaginationData } from 'src/types/get-data.dto';
import { ItemDocument } from '../item/item.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag, TagDocument } from './tag.schema';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tag: Model<TagDocument>) {}

  async findTags(query: getPaginationData) {
    const { results, count } = await aggregateByLength<Tag>(this.tag, {
      query,
      sortBy: -1,
      sortField: '$items',
    });
    return { results: await results.exec(), count };
  }

  async findTag(id: string) {
    return await this.tag.findById(id);
  }

  async findTagBySubstring(substring: string) {
    return await this.tag
      .find({ name: { $regex: substring, $options: 'i' } })
      .limit(10);
  }

  async findOrCreate(tagDto: CreateTagDto) {
    return (
      (await this.tag.findOne({ name: tagDto.name })) ||
      (await this.tag.create({ name: tagDto.name }))
    );
  }

  async addItemToTag(item: ItemDocument, tag_id: string) {
    return await this.tag.findByIdAndUpdate(
      tag_id,
      { $push: { items: item._id } },
      { new: true, useFindAndModify: false },
    );
  }
}
