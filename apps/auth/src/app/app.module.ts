import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@libs/users';
import { AuthLibModule } from '@libs/auth-lib';
import { moduleGenerator, RabbitMqClient } from '@libs/utils';
import { DiscoveryModule } from '@golevelup/nestjs-discovery'


@Module({
  imports: [
    ...moduleGenerator('.auth.env'),
    DiscoveryModule,
    AuthLibModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, RabbitMqClient],
})
export class AppModule {}
