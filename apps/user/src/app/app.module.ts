import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@libs/users';
import { moduleGenerator, RabbitMqClient } from '@libs/utils';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';

@Module({
  imports: [
    DiscoveryModule,
    UsersModule,
    ...moduleGenerator('.user.env'),
  ],
  controllers: [AppController],
  providers: [AppService,RabbitMqClient],
})
export class AppModule {}
