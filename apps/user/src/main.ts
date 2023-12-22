/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { serviceGenerator } from '@libs/utils';

const globalPrefix = 'api/users';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  serviceGenerator(
    'users',
    'The service used for manage users',
    '1.0',
    app,
    globalPrefix,
    'users_queue'
  );
  
  const port = process.env.PORT || 3100;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
