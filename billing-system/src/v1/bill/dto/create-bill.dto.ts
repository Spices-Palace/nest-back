import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsUUID,
  IsOptional,
  ValidateNested,
  ArrayMinSize,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBillItemDto } from './create-bill-item.dto';
import { BillStatus, DiscountType } from '../entities/bill.entity';
import { CreateBillPaymentDto } from './create-bill-payment.dto';

export class CreateBillDto {
  @IsString()
  @IsNotEmpty()
  billNo: string;

  @IsDateString()
  date: Date;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  salesmanName: string;

  @IsUUID()
  companyId: string;

  @IsOptional()
  @IsUUID()
  salesmanId?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateBillItemDto)
  @ArrayMinSize(1)
  items: CreateBillItemDto[];

  @IsNumber()
  totalCGST: number;

  @IsNumber()
  totalSGST: number;

  @IsNumber()
  grandTotal: number;

  @IsEnum(DiscountType)
  discountType: DiscountType;

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @IsOptional()
  @IsNumber()
  finalTotal?: number;

  @IsEnum(BillStatus)
  status: BillStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBillPaymentDto)
  payments: CreateBillPaymentDto[];
} 