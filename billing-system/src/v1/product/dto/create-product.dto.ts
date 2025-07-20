import { IsString, IsNotEmpty, IsNumber, IsInt, IsUUID, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  cost: number;

  @IsNumber()
  price: number;

  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsUUID()
  buyerId: string;

  @IsUUID()
  companyId: string;
}
