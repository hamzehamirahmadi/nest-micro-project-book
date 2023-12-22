import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class payment {
  @Prop({ required: true })
  petmentId: number;

  @Prop({ required: true, default: () => new Date() })
  paidIn: Date;

  @Prop({ ref: 'users', required: true })
  userId: string;

  @Prop({ required: true })
  plan: number;

}

export const PaymentSchemaName = 'payment';
export type PaymentDocument = payment & Document;

export const PaymentSchema = SchemaFactory.createForClass(payment);
