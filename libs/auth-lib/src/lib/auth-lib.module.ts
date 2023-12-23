import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './guards/roles.guard';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    JwtModule
  ],
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
