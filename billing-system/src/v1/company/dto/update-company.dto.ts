import { IsOptional, IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsEmail()
  gmail?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  adminPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  cashierPassword?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  gstNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;
} 