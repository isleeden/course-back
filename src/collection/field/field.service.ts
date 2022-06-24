import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FieldValueDocument } from '../field-value/field-value.schema';
import { CreateFieldDto, UpdateFieldDto } from './dto/create-field.dto';

import { Field, FieldDocument } from './field.schema';

@Injectable()
export class FieldService {
  constructor(@InjectModel(Field.name) private field: Model<FieldDocument>) {}

  async create(fieldDto: CreateFieldDto) {
    return await this.field.create({
      name: fieldDto.name,
      type: fieldDto.type,
      _collection: fieldDto.collection_id,
    });
  }

  async update(fieldDto: UpdateFieldDto) {
    return await this.field.findByIdAndUpdate(fieldDto.id, {
      name: fieldDto.name,
      type: fieldDto.type,
    });
  }

  async addValue(fieldId: string, fieldValue: FieldValueDocument) {
    return await this.field.findByIdAndUpdate(
      fieldId,
      { $push: { fieldValues: fieldValue._id } },
      { new: true, useFindAndModify: false },
    );
  }

  async findById(id: string) {
    return await this.field.findById(id);
  }
}
