import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsEmail()
  @IsNotEmpty()
  gmail: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  adminPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  cashierPassword: string;
}
