import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRoles } from '@libs/auth-lib';

@Schema()
export class User {
  @Prop({ _id: false, required: true, index: true })
  _id: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, default: UserRoles.Member })
  role: string;

  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;
}

export const UserSchemaName = 'users';
export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
