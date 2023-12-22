import { AccessTokenGuard, Roles, RolesGuard, UserRoles } from '@libs/auth-lib';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { PaidDto } from './dtos';

@Controller()
@UseGuards(AccessTokenGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @Roles(UserRoles.Admin)
  @UseGuards(RolesGuard)
  createPaid(@Body() paidDto: PaidDto) {
    return this.appService.paid(paidDto);
  }
}
