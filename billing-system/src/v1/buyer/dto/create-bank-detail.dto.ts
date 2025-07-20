import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBankDetailDto {
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  ifscCode: string;

  @IsString()
  @IsNotEmpty()
  accountHolderName: string;
} 