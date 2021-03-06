import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Collection } from 'src/collection/collection.schema';
import Roles from 'src/types/roles';
import * as mongoose from 'mongoose';
import { Comment } from 'src/comment/comment.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: [Roles.Admin, Roles.User],
    default: Roles.User,
  })
  role: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' }] })
  collections: Collection[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  })
  comments: Comment[];

  @Prop({ default: false })
  blocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
