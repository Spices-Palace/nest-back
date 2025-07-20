import { IsOptional, IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateBankDetailDto } from './create-bank-detail.dto';

export class UpdateBuyerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateBankDetailDto)
  @ArrayMinSize(1)
  bankDetails?: CreateBankDetailDto[];
} 