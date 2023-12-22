import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AccessBookEnum } from '../enums';

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  genre: string;

  @Prop({ required: true })
  publicationYear: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: AccessBookEnum.Normal })
  access: string;
}

export const BookSchemaName = 'books';
export type BookDocument = Book & Document;

export const BookSchema = SchemaFactory.createForClass(Book);
