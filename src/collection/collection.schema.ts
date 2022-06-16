import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Item } from './item/item.schema';

export type CollectionDocument = Collection & Document;

@Schema()
export class Collection {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, default: [] })
  fields: [];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item' })
  items: Item[];

  @Prop({ default: null })
  image: string;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
