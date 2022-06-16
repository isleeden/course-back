import { FieldValue } from './field-value.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Tag } from 'src/tag/Tag.schema';
import { Collection } from './collection.schema';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' })
  _collection: Collection;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FieldValue' }] })
  fieldValues: FieldValue[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }] })
  tags: Tag[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
