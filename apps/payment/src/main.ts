/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { serviceGenerator } from '@libs/utils';

const globalPrefix = 'api/payment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  serviceGenerator(
    'payment',
    'The service used for manage plan and payment',
    '1.0',
    app,
    globalPrefix,
    'payment_queue'
  );
  const port = process.env.PORT || 3300;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
