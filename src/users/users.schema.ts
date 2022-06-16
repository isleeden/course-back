import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import Roles from 'src/types/roles';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true, enum: [Roles.Admin, Roles.User], default: Roles.User })
  role: string;

  @Prop({ default: false })
  blocked: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
