import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
// import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guards/roles.guard';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    JwtModule
  ],
  // imports:[
  //   ConfigModule.forRoot({
  //     envFilePath: '.auth.env',
  //   }),
  //   JwtModule.registerAsync({
  //     imports: [ConfigModule],
  //     useFactory: async (configService: ConfigService) => ({
  //       global: true,
  //       secret: configService.get('JWT_ACCESS_SECRET'),
  //       signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIRE_TIME') },
  //     }),
  //     inject: [ConfigService],
  //   }),
  // ],
  controllers: [],
  providers: [
    RefreshTokenStrategy,
    AccessTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [RefreshTokenStrategy, AccessTokenStrategy],
})
export class AuthLibModule {}
