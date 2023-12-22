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
import { CartDto } from '../dtos';
import { CartService } from '../services/cart.service';

@Controller('/cart')
// @UseGuards(AccessTokenGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/userId/:userId')
  getAllByUserId(@Param('userId') userId: string) {
    return this.cartService.getByUserId(userId);
  }

  @Post('/addToCart')
  addToCart(@Body() cartDto: CartDto) {
    return this.cartService.addTocart(cartDto);
  }

  @Delete('/:id')
  deleteById(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  
}
