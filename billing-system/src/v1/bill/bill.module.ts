import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { BillItem } from './entities/bill-item.entity';
import { Product } from '../product/entities/product.entity';
import { Company } from '../company/entities/company.entity';
import { Salesman } from '../salesman/entities/salesman.entity';
import { BillPayment } from './entities/bill-payment.entity';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bill, BillItem, Product, Company, Salesman, BillPayment]),
  ],
  providers: [BillService],
  controllers: [BillController],
  exports: [BillService],
})
export class BillModule {} 