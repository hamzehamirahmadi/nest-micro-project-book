import { moduleGenerator, RabbitMqClient } from '@libs/utils';
import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { BooksService } from './app.service';
import { UsersModule } from '@libs/users';
import {
  AccessSchema,
  AccessSchemaName,
  BookSchema,
  BookSchemaName,
  CartSchema,
  CartSchemaName,
} from './schames';
import { AuthLibModule } from '@libs/auth-lib';
import { AccessBookStrategy } from './strategies';
import { AccessService, CartService } from './services';
import {
  AccessBookRabbitMQConsumerController,
  CartController,
} from './controllers';

@Module({
  imports: [
    ...moduleGenerator('.books.env'),
    DiscoveryModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: BookSchemaName, schema: BookSchema },
      { name: AccessSchemaName, schema: AccessSchema },
      { name: CartSchemaName, schema: CartSchema },
    ]),
  ],
  controllers: [
    AppController,
    AccessBookRabbitMQConsumerController,
    CartController,
  ],
  providers: [
    BooksService,
    RabbitMqClient,
    AccessBookStrategy,
    AccessService,
    CartService,
  ],
})
export class AppModule {}
