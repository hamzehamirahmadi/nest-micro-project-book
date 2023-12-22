import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RabbitMqClient } from '@libs/utils';
import { Book, BookDocument, BookSchemaName } from './schames/book.schema';
import { CreateBookDto, SearchBooksDto, UpdateBookDto } from './dtos';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(BookSchemaName) private bookModel: Model<Book>,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookDocument> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async findAll(): Promise<BookDocument[]> {
    return this.bookModel.find().exec();
  }

  async findById(id: string): Promise<BookDocument | null> {
    const bookCache: string = await this.redis.get(id);
    if (bookCache) {      
      return JSON.parse(bookCache);
    }

    const book = await this.bookModel.findById(id);
    if (!book) {
      return book;
    }
    await this.redis.set(id, JSON.stringify(book));
    return book;
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto
  ): Promise<BookDocument | null> {
    return await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<BookDocument | unknown> {
    return await this.bookModel.findByIdAndDelete(id).exec();
  }

  async searchBooks(query: string, user: any): Promise<BookDocument[]> {
    const filter = {
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } },
            { genre: { $regex: query, $options: 'i' } },
            { publicationYear: { $regex: query, $options: 'i' } },
          ],
        },
        {
          access: user.accessBook,
        },
      ],
    };

    return this.bookModel.find(filter).exec();
  }
}
