/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { serviceGenerator } from '@libs/utils';

import { AppModule } from './app/app.module';
const globalPrefix = 'api/books';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  serviceGenerator(
    'books',
    'The service used for book products',
    '1.0',
    app,
    globalPrefix,
    'books_queue'
  );
  const port = process.env.PORT || 3200;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
