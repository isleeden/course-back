import { ItemService } from './../item/item.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import FieldTypes from 'src/types/field-types';
import { FieldService } from '../field/field.service';
import { CreateFieldValueDto } from './dto/create-field-value.dto';
import { FieldValue, FieldValueDocument } from './field-value.schema';

@Injectable()
export class FieldValueService {
  constructor(
    @InjectModel(FieldValue.name)
    private fieldValueModel: Model<FieldValueDocument>,
    private fieldService: FieldService,
    @Inject(forwardRef(() => ItemService))
    private itemService: ItemService,
  ) {}

  async addField(fieldValueDto: CreateFieldValueDto, itemId: string) {
    await this.validateValue(fieldValueDto, itemId);
    const createdValue = await this.findOrCreate(fieldValueDto, itemId);
    await this.bindValue(fieldValueDto, createdValue, itemId);
    return createdValue;
  }

  private async findOrCreate(
    fieldValueDto: CreateFieldValueDto,
    itemId: string,
  ) {
    return (
      (await this.fieldValueModel.findOneAndUpdate(
        { item: itemId, field: fieldValueDto.field_id },
        {
          value: fieldValueDto.value,
        },
      )) ||
      (await this.fieldValueModel.create({
        value: fieldValueDto.value,
        item: itemId,
        field: fieldValueDto.field_id,
      }))
    );
  }

  private async bindValue(
    fieldValueDto: CreateFieldValueDto,
    fieldValue: FieldValueDocument,
    itemId: string,
  ) {
    await this.fieldService.addValue(fieldValueDto.field_id, fieldValue);
    await this.itemService.addValue(itemId, fieldValue);
  }

  private async validateValue(
    fieldValueDto: CreateFieldValueDto,
    itemId: string,
  ) {
    const field = await this.fieldService.findById(fieldValueDto.field_id);
    const item = await this.itemService.findById(itemId);
    if (item._collection._id.toString() !== field._collection._id.toString()) {
      throw new BadRequestException();
    }
    this.checkType(field.type, fieldValueDto.value);
  }

  private checkType = (type: FieldTypes, value: any) => {
    switch (type) {
      case FieldTypes.Text:
        if (typeof value === 'string') return;
        else throw new BadRequestException();
      case FieldTypes.Number:
        if (!isNaN(value)) return;
        else throw new BadRequestException();
      case FieldTypes.Bigtext:
        if (typeof value === 'string') return;
        else throw new BadRequestException();
      case FieldTypes.Boolean:
        if (typeof value === 'boolean') return;
        else throw new BadRequestException();
      case FieldTypes.Date:
        if (new Date(value).getTime() > 0) return;
        else throw new BadRequestException();
      default:
        break;
    }
  };
}
