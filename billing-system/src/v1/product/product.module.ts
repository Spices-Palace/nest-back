import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { SalePrice } from './entities/sale-price.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Buyer } from '../buyer/entities/buyer.entity';
import { Company } from '../company/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, SalePrice, Buyer, Company])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {} 