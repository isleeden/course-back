import { User } from '../users/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Item } from '../item/item.schema';
import { Like } from 'src/like/like.schema';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true })
  item: Item;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }] })
  likes: Like[];

  @Prop({ required: true })
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
