import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { Bill, BillStatus } from './entities/bill.entity';

@Controller('v1/bills')
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post()
  async create(@Body(ValidationPipe) createBillDto: CreateBillDto): Promise<Bill> {
    return this.billService.create(createBillDto);
  }

  @Get()
  async findAll(@Query('companyId') companyId: string): Promise<Bill[]> {
    return this.billService.findAll(companyId);
  }

  @Get('bill-no/:billNo')
  async findByBillNo(@Param('billNo') billNo: string): Promise<Bill> {
    return this.billService.findByBillNo(billNo);
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: BillStatus): Promise<Bill> {
    return this.billService.updateStatus(id, status);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.billService.delete(id);
  }

  @Get('by-company-date')
  async findAllByCompanyAndDate(
    @Query('companyId') companyId: string,
    @Query('date') date: string,
  ): Promise<Bill[]> {
    return this.billService.findAllByCompanyAndDate(companyId, date);
  }

  @Delete('bill-no/:billNo')
  async deleteByBillNo(@Param('billNo') billNo: string) {
    return this.billService.deleteByBillNo(billNo);
  }

  @Get('salesman-commission-report')
  async getSalesmanCommissionReport(
    @Query('companyId') companyId: string,
    @Query('date') date: string,
  ) {
    return this.billService.getSalesmanCommissionReport(companyId, date);
  }

  @Get('daily-sales-report')
  async getDailySalesReport(@Query('companyId') companyId: string, @Query('date') date: string) {
    // Get all bills for the company and date, including payments
    const bills = await this.billService.findAllByCompanyAndDate(companyId, date);
    let totalSales = 0;
    // Note: payment.method is a string comparison for compatibility with enum values
    const paymentBreakdown = { cash: 0, gpay: 0, card: 0, other: 0 };
    const allPayments = [];
    
    for (const bill of bills) {
      totalSales += Number(bill.finalTotal || bill.grandTotal);
      if (bill.payments && Array.isArray(bill.payments)) {
        for (const payment of bill.payments) {
          // Add to breakdown
          if (payment.method === 'Cash') paymentBreakdown.cash += Number(payment.amount);
          else if (payment.method === 'UPI') paymentBreakdown.gpay += Number(payment.amount);
          else if (payment.method === 'Card') paymentBreakdown.card += Number(payment.amount);
          else paymentBreakdown.other += Number(payment.amount);
          
          // Add to detailed payments list
          allPayments.push({
            billNo: bill.billNo,
            customerName: bill.customerName,
            method: payment.method,
            amount: Number(payment.amount),
            billId: bill.id
          });
        }
      }
    }
    return { 
      totalSales, 
      paymentBreakdown,
      allPayments 
    };
  }

  // Move this to the bottom to avoid route conflicts
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Bill> {
    return this.billService.findOne(id);
  }
} 