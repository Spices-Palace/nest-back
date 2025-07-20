import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salesman } from './entities/salesman.entity';
import { CreateSalesmanDto } from './dto/create-salesman.dto';
import { UpdateSalesmanDto } from './dto/update-salesman.dto';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class SalesmanService {
  constructor(
    @InjectRepository(Salesman)
    private readonly salesmanRepository: Repository<Salesman>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createDto: CreateSalesmanDto): Promise<Salesman> {
    const company = await this.companyRepository.findOne({ where: { id: createDto.companyId } });
    if (!company) throw new NotFoundException('Company not found');
    const salesman = this.salesmanRepository.create({
      ...createDto,
      company,
    });
    return this.salesmanRepository.save(salesman);
  }

  async findAll(companyId?: string): Promise<Salesman[]> {
    const where = companyId ? { company: { id: companyId } } : {};
    return this.salesmanRepository.find({
      where,
      relations: ['company'],
    });
  }

  async update(id: string, updateDto: UpdateSalesmanDto): Promise<Salesman> {
    const salesman = await this.salesmanRepository.findOne({ where: { id }, relations: ['company'] });
    if (!salesman) throw new NotFoundException('Salesman not found');
    if (updateDto.companyId) {
      const company = await this.companyRepository.findOne({ where: { id: updateDto.companyId } });
      if (!company) throw new NotFoundException('Company not found');
      salesman.company = company;
    }
    Object.assign(salesman, updateDto);
    return this.salesmanRepository.save(salesman);
  }

  async delete(id: string): Promise<{ message: string }> {
    const salesman = await this.salesmanRepository.findOne({ where: { id } });
    if (!salesman) throw new NotFoundException('Salesman not found');
    await this.salesmanRepository.remove(salesman);
    return { message: 'Salesman deleted successfully' };
  }
} 