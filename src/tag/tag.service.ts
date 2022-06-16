import { ItemDocument } from '../collection/schemas/item.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag, TagDocument } from './Tag.schema';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tag: Model<TagDocument>) {}

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
