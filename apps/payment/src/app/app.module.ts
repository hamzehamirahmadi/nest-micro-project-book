import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { moduleGenerator, RabbitMqClient } from '@libs/utils';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@libs/users';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema, PaymentSchemaName } from './schames';
import { AuthLibModule } from '@libs/auth-lib';

@Module({
  imports: [
    DiscoveryModule,
    UsersModule,
    AuthLibModule,
    MongooseModule.forFeature([
      { name: PaymentSchemaName, schema: PaymentSchema },
    ]),
    ...moduleGenerator('.payment.env'),
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMqClient],
})
export class AppModule {}
