import { TagSchema } from './../tag/tag.schema';
import { FieldValue } from '../field-value/field-value.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Tag } from 'src/tag/tag.schema';
import { Collection } from '../collection/collection.schema';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    required: true,
  })
  _collection: Collection;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: FieldValue[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FieldValue' }] })
  fieldValues: FieldValue[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  })
  tags: Tag[];
}

const ItemSchema = SchemaFactory.createForClass(Item);

ItemSchema.index({ '$**': 'text' });

export { ItemSchema };
