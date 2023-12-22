import { RabbitMqClient } from '@libs/utils';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaidDto } from './dtos';
import { PaymentSchemaName, payment } from './schames';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(PaymentSchemaName) private paymentModel: Model<payment>,
    private rabbitClient: RabbitMqClient
  ) {}

  async ttt(){}

  async paid(paidDto: PaidDto) {
    const createPayment = new this.paymentModel(paidDto);
    const resCreatePayment = await createPayment.save();
    this.rabbitClient.sendMessage('accessBook', createPayment);
    return resCreatePayment;
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
