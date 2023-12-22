import { AccessTokenGuard, Roles, RolesGuard, UserRoles } from '@libs/auth-lib';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BooksService } from './app.service';
import { CreateBookDto, UpdateBookDto } from './dtos';
import { AccessGuard } from './guards';

@Controller()
@UseGuards(AccessTokenGuard)
export class AppController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAll() {
    return this.booksService.findAll();
  }

  @Get('search/:search')
  @Roles(UserRoles.Member)
  @UseGuards(RolesGuard)
  searchBook(@Param('search') search: string,@Req() req: any) {    
    return this.booksService.searchBooks(search, req.user);
  }

  @Get(':id')
  @Roles(UserRoles.Member)
  @UseGuards(RolesGuard)
  getById(@Param('id') id: string) {
    return this.booksService.findById(id);
  }

  @Post()
  @Roles(UserRoles.Admin)
  @UseGuards(RolesGuard)
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Patch(':id')
  @Roles(UserRoles.Admin)
  @UseGuards(RolesGuard)
  updateBook(@Body() updateBookDto: UpdateBookDto, @Param('id') id: string) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @Roles(UserRoles.Admin)
  @UseGuards(RolesGuard)
  deleteById(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
