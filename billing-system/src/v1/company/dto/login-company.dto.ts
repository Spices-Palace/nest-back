import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class LoginCompanyDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn(['admin', 'cashier'])
  role: 'admin' | 'cashier';
}
