import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '@libs/users';
import { AccessBookEnum } from '../enums';

@Schema()
export class Access {
  @Prop({ required: true, default: AccessBookEnum.Normal })
  accuntType: string;

  @Prop({ required: true, default: () => new Date() })
  expireIn: Date;

  @Prop({ ref: 'users', required: true })
  userId: string;
}

export const AccessSchemaName = 'Access';
export type AccessDocument = Access & Document;

export const AccessSchema = SchemaFactory.createForClass(Access);
