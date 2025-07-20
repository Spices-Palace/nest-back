import { Controller, Post, Get, Put, Delete, Param, Body, Query, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSalePriceDto } from './dto/create-sale-price.dto';
import { Product } from './entities/product.entity';
import { SalePrice } from './entities/sale-price.entity';

@Controller('v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body(ValidationPipe) createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(@Query('companyId') companyId: string): Promise<any[]> {
    const products = await this.productService.findAll(companyId);
    return products.map(product => ({
      ...product,
      buyer: product.buyer ? { name: product.buyer.name } : null,
      company: product.company ? { companyName: product.company.companyName } : null,
    }));
  }

  @Post('sale-price')
  async createSalePrice(@Body(ValidationPipe) createSalePriceDto: CreateSalePriceDto): Promise<SalePrice> {
    return this.productService.createSalePrice(createSalePriceDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
} 