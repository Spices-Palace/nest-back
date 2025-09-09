import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { LoginCompanyDto } from './dto/login-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const existing = await this.companyRepository.findOne({
      where: [
        { companyName: createCompanyDto.companyName },
        { gmail: createCompanyDto.gmail },
      ],
    });
    if (existing) {
      throw new ConflictException(
        'Company with this name or gmail already exists',
      );
    }
    const hashedAdminPassword = await bcrypt.hash(
      createCompanyDto.adminPassword,
      10,
    );
    const hashedCashierPassword = await bcrypt.hash(
      createCompanyDto.cashierPassword,
      10,
    );
    const company = this.companyRepository.create({
      ...createCompanyDto,
      adminPassword: hashedAdminPassword,
      cashierPassword: hashedCashierPassword,
    });
    return this.companyRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async login(loginDto: LoginCompanyDto) {
    const { companyName, password, role } = loginDto;
    const company = await this.companyRepository.findOne({
      where: { companyName },
    });
    if (!company) throw new NotFoundException('Company not found');

    const hash =
      role === 'admin' ? company.adminPassword : company.cashierPassword;
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return {
      companyId: company.id,
      companyName: company.companyName,
      role,
      message: 'Login successful',
    };
  }

  async update(id: string, updateDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');

    if (updateDto.adminPassword) {
      updateDto.adminPassword = await bcrypt.hash(updateDto.adminPassword, 10);
    }
    if (updateDto.cashierPassword) {
      updateDto.cashierPassword = await bcrypt.hash(
        updateDto.cashierPassword,
        10,
      );
    }

    Object.assign(company, updateDto);
    return this.companyRepository.save(company);
  }

  async delete(id: string): Promise<{ message: string }> {
    const company = await this.companyRepository.findOne({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    await this.companyRepository.remove(company);
    return { message: 'Company deleted successfully' };
  }
}
