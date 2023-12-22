import {
  RefreshTokenGuard,
  Roles,
  RolesGuard,
  UserRoles,
} from '@libs/auth-lib';
import { CreateUserDto, SignInUserDto } from '@libs/users';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.appService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() signInUserDto: SignInUserDto) {
    return this.appService.signIn(signInUserDto);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refreshToken(@Req() req: any) {
    return this.appService.refreshTokens(
      req.user['_id'],
      req.user['refreshToken']
    );
  }

  @Get('test')
  @Roles(UserRoles.Member)
  @UseGuards(RolesGuard)
  test(@Req() req: any) {
    return 'ok';
  }
}
