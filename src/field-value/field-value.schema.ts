import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Field } from '../field/field.schema';
import { Item } from '../item/item.schema';

export type FieldValueDocument = FieldValue & Document;

@Schema()
export class FieldValue {
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  value: any;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true })
  item: Item;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true })
  field: Field;
}

export const FieldValueSchema = SchemaFactory.createForClass(FieldValue);
