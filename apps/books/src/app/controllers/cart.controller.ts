import { AccessTokenGuard, Roles, RolesGuard, UserRoles } from '@libs/auth-lib';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartDto } from '../dtos';
import { CartService } from '../services/cart.service';

@Controller('/cart')
@UseGuards(AccessTokenGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/userId/:userId')
  @Roles(UserRoles.Member)
  @UseGuards(RolesGuard)
  getAllByUserId(@Param('userId') userId: string) {
    return this.cartService.getByUserId(userId);
  }

  @Post('/addToCart')
  @Roles(UserRoles.Member)
  @UseGuards(RolesGuard)
  addToCart(@Body() cartDto: CartDto) {
    return this.cartService.addTocart(cartDto);
  }

  @Delete('/:id')
  @Roles(UserRoles.Member)
  @UseGuards(RolesGuard)
  deleteById(@Param('id') id: string) {
    return this.cartService.remove(id);
  }

  
}
