import { Controller, Post, Get, Put, Delete, Param, Body, Query, ValidationPipe } from '@nestjs/common';
import { SalesmanService } from './salesman.service';
import { CreateSalesmanDto } from './dto/create-salesman.dto';
import { UpdateSalesmanDto } from './dto/update-salesman.dto';
import { Salesman } from './entities/salesman.entity';

@Controller('v1/salesmen')
export class SalesmanController {
  constructor(private readonly salesmanService: SalesmanService) {}

  @Post()
  async create(@Body(ValidationPipe) createDto: CreateSalesmanDto): Promise<Salesman> {
    return this.salesmanService.create(createDto);
  }

  @Get()
  async findAll(@Query('companyId') companyId: string): Promise<Salesman[]> {
    return this.salesmanService.findAll(companyId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDto: UpdateSalesmanDto,
  ): Promise<Salesman> {
    return this.salesmanService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.salesmanService.delete(id);
  }
} 