import { User } from '../users/users.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Comment } from 'src/comment/comment.schema';

export type LikeDocument = Like & Document;

@Schema()
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  })
  comment: Comment;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
