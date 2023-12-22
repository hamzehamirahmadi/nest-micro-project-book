import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipeObject } from '@libs/errors-handler';
import { Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@nestjs-modules/ioredis';

export function moduleGenerator(envFilePath: string) {
  return [
    ConfigModule.forRoot({
      envFilePath,
    }),

    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        url: configService.get('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIRE_TIME') },
      }),
      inject: [ConfigService],
    }),
  ];
}

export async function serviceGenerator(
  name: string,
  description: string,
  version: string,
  app: INestApplication,
  globalPrefix: string,
  queueName: string
) {
  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env['RABBITMQ_URL']],
      queue: queueName,
      queueOptions: { durable: false },
      prefetchCount: 1,
    },
  });

  const config = new DocumentBuilder()
    .setTitle(`${name} Service`)
    .setDescription(description)
    .setVersion(version)
    .addServer(globalPrefix)
    .addTag(name)
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe(
      ValidationPipeObject({
        transform: true,
        whitelist: false,
        forbidNonWhitelisted: false,
      })
    )
  );
  await app.startAllMicroservices();
}
