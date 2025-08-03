import { Controller, Get, Post, Body, Param, Put, Request, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../company/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('v1/reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('generate')
  generateReport(
    @Body('date') date: Date,
    @Request() req,
  ) {
    return this.reportService.generateDailyReport(
      date,
      req.user.companyId,
      req.user.id,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.reportService.findAll(req.user.companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.reportService.findOne(id, req.user.companyId);
  }

  @Get('date/:date')
  findByDate(
    @Param('date') date: Date,
    @Request() req,
  ) {
    const dateString = typeof date === 'string' ? date : date.toISOString().slice(0, 10);
    return this.reportService.findByDate(dateString, req.user.companyId);
  }

  @Put(':id/expenses')
  updateExpenses(
    @Param('id') id: string,
    @Body('expenses') expenses: number,
    @Request() req,
  ) {
    return this.reportService.updateExpenses(id, expenses, req.user.companyId);
  }
} 