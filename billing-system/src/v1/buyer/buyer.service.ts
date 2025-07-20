import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buyer } from './entities/buyer.entity';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';

@Injectable()
export class BuyerService {
  constructor(
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,
  ) {}

  async create(createBuyerDto: CreateBuyerDto): Promise<Buyer> {
    const buyer = this.buyerRepository.create(createBuyerDto);
    return this.buyerRepository.save(buyer);
  }

  async findAll(): Promise<Buyer[]> {
    return this.buyerRepository.find();
  }

  async update(id: string, updateBuyerDto: UpdateBuyerDto): Promise<Buyer> {
    const buyer = await this.buyerRepository.findOne({ where: { id } });
    if (!buyer) throw new NotFoundException('Buyer not found');
    Object.assign(buyer, updateBuyerDto);
    return this.buyerRepository.save(buyer);
  }

  async delete(id: string): Promise<{ message: string }> {
    const buyer = await this.buyerRepository.findOne({ where: { id } });
    if (!buyer) throw new NotFoundException('Buyer not found');
    await this.buyerRepository.remove(buyer);
    return { message: 'Buyer deleted successfully' };
  }
} 