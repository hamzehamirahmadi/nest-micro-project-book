import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Roles, RolesGuard, UserRoles } from '@libs/auth-lib';
import { AppService } from './app.service';
import { UpdateUserDto, UsersService } from '@libs/users';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRoles.Admin)
  @UseGuards(RolesGuard)
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  @Roles(UserRoles.Admin)
  @UseGuards(RolesGuard)
  getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRoles.Admin)
  @UseGuards(RolesGuard)
  updateUser(@Body() user: UpdateUserDto, @Param('id') id: string) {
    return this.usersService.updateAndSendQ(id, user);
  }

  @Delete(':id')
  @Roles(UserRoles.Admin)
  @UseGuards(RolesGuard)
  deleteUser(@Param('id') id: string) {
    return this.usersService.removeAndSendQ(id);
  }
}
