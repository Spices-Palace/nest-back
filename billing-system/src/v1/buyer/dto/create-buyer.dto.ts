import { IsString, IsNotEmpty, IsOptional, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBankDetailDto } from './create-bank-detail.dto';

export class CreateBuyerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateBankDetailDto)
  @ArrayMinSize(1)
  bankDetails: CreateBankDetailDto[];
} 