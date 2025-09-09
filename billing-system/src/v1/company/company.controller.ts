import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { LoginCompanyDto } from './dto/login-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { JwtAuthService } from './jwt-auth.service';
import { Public } from './public.decorator';

@Controller('v1/companies')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Public()
  @Post()
  async create(@Body(ValidationPipe) createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }
  @Public()
  @Get()
  async findAll(): Promise<
    { id: string; companyName: string; gstNumber?: string | null; address?: string | null }[]
  > {
    const companies = await this.companyService.findAll();
    return companies.map(({ id, companyName, gstNumber, address }) => ({
      id,
      companyName,
      gstNumber,
      address,
    }));
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Company> {
    return this.companyService.findOne(id);
  }

  @Public()
  @Post('login')
  async login(
    @Body(ValidationPipe) loginCompanyDto: LoginCompanyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.companyService.login(loginCompanyDto);
    const payload = {
      companyId: user.companyId,
      companyName: user.companyName,
      role: user.role,
    };
    const token = this.jwtAuthService.signPayload(payload);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
    });
    return {
      ...user,
      token,
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDto: UpdateCompanyDto,
  ): Promise<Company> {
    return await this.companyService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.companyService.delete(id);
  }
}
