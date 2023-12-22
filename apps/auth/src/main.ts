/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { serviceGenerator } from '@libs/utils';
import { Transport } from '@nestjs/microservices';

const globalPrefix = 'api/auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  serviceGenerator(
    'auth',
    'The service used for user authentication',
    '1.0',
    app,
    globalPrefix,
    'auth_queue'
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
