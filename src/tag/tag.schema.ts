import { Item } from 'src/item/item.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TagDocument = Tag & Document;

@Schema()
export class Tag {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] })
  items: Item[];
}

export const TagSchema = SchemaFactory.createForClass(Tag);
