import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartDto } from '../dtos';
import { Cart, CartDocument, CartSchemaName } from '../schames';

@Injectable()
export class CartService {
  constructor(@InjectModel(CartSchemaName) private cartModel: Model<Cart>) {}

  async addTocart(cartDto: CartDto) {
    const exist = await this.getByUserAndBook(cartDto.userId, cartDto.bookId);
    if (exist) {
      console.log(exist);

      if (exist.count <= 0 || (exist.count === 1 && cartDto.count < 0)) {
        return await this.remove(exist._id);
      }
      return await this.cartModel.findOneAndUpdate(
        { userId: cartDto.userId, bookId: cartDto.bookId },
        { $inc: { count: cartDto.count } },
        { new: true }
      );
    }

    if (cartDto.count < 0) {
      return new BadRequestException('The Count cannot be negative');
    }

    return this.create(cartDto);
  }

  async clearCart(userId: string) {
    return await this.cartModel.deleteMany({ userId }).exec();
  }
  async remove(id: string) {
    return await this.cartModel.findByIdAndDelete(id).exec();
  }
  async create(cartDto: CartDto) {
    const createCart = new this.cartModel(cartDto);
    return createCart.save();
  }

  async getByUserId(
    id: string
  ): Promise<{ carts: CartDocument[]; totalPrice: number }> {
    const carts = await this.cartModel
      .find({ userId: id })
      .populate('userId')
      .populate('bookId')
      .exec();

    return {
      carts,
      totalPrice: carts
        .map((item) => item.count * (item.bookId as any).price)
        .reduce((acc, curr) => acc + curr, 0),
    };
  }

  async getByUserAndBook(
    userId: string,
    bookId: string
  ): Promise<CartDocument> {
    return this.cartModel.findOne({ userId, bookId }).exec();
  }
}
