import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class UpdateSalesmanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  commissionRate?: number;

  @IsUUID()
  @IsOptional()
  companyId?: string;
} 