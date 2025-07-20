import { IsNumber, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateSalePriceDto {
  @IsNumber()
  salePrice: number;

  @IsUUID()
  productId: string;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;
} 