import { IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateBillItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  productName: string;

  @IsString()
  originalBarcode: string;

  @IsString()
  saleBarcode: string;

  @IsString()
  productType: string;

  @IsString()
  unit: string;

  @IsNumber()
  originalPrice: number;

  @IsNumber()
  salePrice: number;

  @IsNumber()
  total: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  cgst: number;

  @IsNumber()
  sgst: number;

  @IsNumber()
  priceIncrease: number;
} 