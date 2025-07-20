import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { BuyerModule } from './buyer/buyer.module';
import { ProductModule } from './product/product.module';
import { SalesmanModule } from './salesman/salesman.module';
import { BillModule } from './bill/bill.module';

@Module({
  imports: [CompanyModule, BuyerModule, ProductModule, SalesmanModule, BillModule],
})
export class V1Module {}
