import { Controller, Post, Get, Put, Delete, Param, Body, ValidationPipe } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { Buyer } from './entities/buyer.entity';

@Controller('v1/buyers')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post()
  async create(@Body(ValidationPipe) createBuyerDto: CreateBuyerDto): Promise<Buyer> {
    return this.buyerService.create(createBuyerDto);
  }

  @Get()
  async findAll(): Promise<Buyer[]> {
    return this.buyerService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBuyerDto: UpdateBuyerDto,
  ): Promise<Buyer> {
    return this.buyerService.update(id, updateBuyerDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.buyerService.delete(id);
  }
} 