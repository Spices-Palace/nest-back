import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salesman } from './entities/salesman.entity';
import { SalesmanService } from './salesman.service';
import { SalesmanController } from './salesman.controller';
import { Company } from '../company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salesman, Company])],
  providers: [SalesmanService],
  controllers: [SalesmanController],
})
export class SalesmanModule {} 