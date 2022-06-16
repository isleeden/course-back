import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Collection } from './collection.schema';
import FieldTypes from 'src/types/field-types';
import { FieldValue } from './field-value.schema';

export type FieldDocument = Field & Document;

@Schema()
export class Field {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: [
      FieldTypes.Text,
      FieldTypes.Bigtext,
      FieldTypes.Boolean,
      FieldTypes.Date,
      FieldTypes.Number,
    ],
  })
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' })
  _collection: Collection;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FieldValue' }] })
  fieldValues: FieldValue[];
}

export const FieldSchema = SchemaFactory.createForClass(Field);
