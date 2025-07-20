import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { SalePrice } from './entities/sale-price.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateSalePriceDto } from './dto/create-sale-price.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Buyer } from '../buyer/entities/buyer.entity';
import { Company } from '../company/entities/company.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(SalePrice)
    private readonly salePriceRepository: Repository<SalePrice>,
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const buyer = await this.buyerRepository.findOne({ where: { id: createProductDto.buyerId } });
    if (!buyer) throw new NotFoundException('Buyer not found');
    const company = await this.companyRepository.findOne({ where: { id: createProductDto.companyId } });
    if (!company) throw new NotFoundException('Company not found');
    const product = this.productRepository.create({
      ...createProductDto,
      buyer,
      company,
    });
    return this.productRepository.save(product);
  }

  async findAll(companyId?: string): Promise<Product[]> {
    const where = companyId ? { company: { id: companyId } } : {};
    return this.productRepository.find({
      where,
      relations: ['buyer', 'company', 'salePrices'],
    });
  }

  async createSalePrice(createSalePriceDto: CreateSalePriceDto): Promise<SalePrice> {
    const product = await this.productRepository.findOne({ where: { id: createSalePriceDto.productId } });
    if (!product) throw new NotFoundException('Product not found');
    const salePrice = this.salePriceRepository.create({
      salePrice: createSalePriceDto.salePrice,
      effectiveDate: createSalePriceDto.effectiveDate ? new Date(createSalePriceDto.effectiveDate) : undefined,
      product,
    });
    return this.salePriceRepository.save(salePrice);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['buyer', 'company', 'salePrices'] });
    if (!product) throw new NotFoundException('Product not found');
    if (updateProductDto.buyerId) {
      const buyer = await this.buyerRepository.findOne({ where: { id: updateProductDto.buyerId } });
      if (!buyer) throw new NotFoundException('Buyer not found');
      product.buyer = buyer;
    }
    if (updateProductDto.companyId) {
      const company = await this.companyRepository.findOne({ where: { id: updateProductDto.companyId } });
      if (!company) throw new NotFoundException('Company not found');
      product.company = company;
    }
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async delete(id: string): Promise<{ message: string }> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async updateQuantity(id: string, quantityChange: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    
    const newQuantity = product.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error(`Cannot reduce quantity below 0. Current: ${product.quantity}, Change: ${quantityChange}`);
    }
    
    product.quantity = newQuantity;
    return this.productRepository.save(product);
  }

  async checkInventoryAvailability(productId: string, requestedQuantity: number): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    return product.quantity >= requestedQuantity;
  }

  async getProductWithInventory(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { id },
      relations: ['buyer', 'company', 'salePrices']
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
} 