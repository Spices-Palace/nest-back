import { IsString, IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateBillItemDto {
  @IsUUID()
  productId: string;

  @IsString()
  productName: string;

  @IsString()
  @IsOptional()
  originalBarcode?: string;

  @IsString()
  @IsOptional()
  saleBarcode?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

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