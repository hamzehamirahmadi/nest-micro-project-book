import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { RabbitMqClient } from '@libs/utils';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRabbitMQConsumerController } from './controllers';
import { UserSchema, UserSchemaName } from './schemas/user.schema';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: UserSchemaName, schema: UserSchema }]),
    DiscoveryModule,
  ],
  controllers: [UserRabbitMQConsumerController],
  providers: [UsersService, RabbitMqClient],
  exports: [UsersService],
})
export class UsersModule {}
