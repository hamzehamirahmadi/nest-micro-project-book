import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Cart {
  @Prop({ ref: 'books', required: true })
  bookId: string;

  @Prop({ ref: 'users', required: true })
  userId: string;

  @Prop({ required: true })
  count: number;

}

export const CartSchemaName = 'cart';
export type CartDocument = Cart & Document;

export const CartSchema = SchemaFactory.createForClass(Cart);
