import { IsEnum, IsNumber } from 'class-validator';
import { PaymentMethod } from '../entities/bill-payment.entity';

export class CreateBillPaymentDto {
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNumber()
  amount: number;
} 