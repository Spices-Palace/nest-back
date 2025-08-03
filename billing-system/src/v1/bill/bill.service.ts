import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Bill, BillStatus } from './entities/bill.entity';
import { BillItem } from './entities/bill-item.entity';
import { Product } from '../product/entities/product.entity';
import { Company } from '../company/entities/company.entity';
import { Salesman } from '../salesman/entities/salesman.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { BillPayment } from './entities/bill-payment.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
    @InjectRepository(BillItem)
    private readonly billItemRepository: Repository<BillItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Salesman)
    private readonly salesmanRepository: Repository<Salesman>,
    @InjectRepository(BillPayment)
    private readonly billPaymentRepository: Repository<BillPayment>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBillDto: CreateBillDto): Promise<Bill> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate company exists
      const company = await this.companyRepository.findOne({ 
        where: { id: createBillDto.companyId } 
      });
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      // Validate salesman exists if provided
      let salesman: Salesman | null = null;
      if (createBillDto.salesmanId) {
        salesman = await this.salesmanRepository.findOne({ 
          where: { id: createBillDto.salesmanId } 
        });
        if (!salesman) {
          throw new NotFoundException('Salesman not found');
        }
      }

      // Validate products and check inventory
      const productIds = createBillDto.items.map(item => item.productId);
      const products = await this.productRepository.find({ 
        where: productIds.map(id => ({ id })) 
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
      }

      // Check inventory availability
      for (const item of createBillDto.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }
        if (product.quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient inventory for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
          );
        }
      }

      // Create bill
      const bill = this.billRepository.create({
        billNo: createBillDto.billNo,
        date: new Date(createBillDto.date),
        customerName: createBillDto.customerName,
        salesmanName: createBillDto.salesmanName,
        company,
        salesman,
        totalCGST: createBillDto.totalCGST,
        totalSGST: createBillDto.totalSGST,
        grandTotal: createBillDto.grandTotal,
        status: createBillDto.status || BillStatus.COMPLETED,
        discountType: createBillDto.discountType,
        discountValue: createBillDto.discountValue,
        discountAmount: createBillDto.discountAmount,
        finalTotal: createBillDto.finalTotal,
      });

      // Map and create BillPayment entities from dto.payments and associate them with the bill
      const payments = createBillDto.payments.map(paymentDto => this.billPaymentRepository.create(paymentDto));

      const savedBill = await queryRunner.manager.save(bill);

      // Save payments and associate them with the bill
      for (const payment of payments) {
        payment.bill = Array.isArray(savedBill) ? savedBill[0] : savedBill;
        await queryRunner.manager.save(payment);
      }

      // Create bill items and update inventory
      const billItems: BillItem[] = [];
      for (const itemDto of createBillDto.items) {
        const product = products.find(p => p.id === itemDto.productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${itemDto.productId} not found`);
        }
        
        // Create bill item
        const billItem = this.billItemRepository.create({
          bill: Array.isArray(savedBill) ? savedBill[0] : savedBill,
          product,
          productName: itemDto.productName,
          originalBarcode: itemDto.originalBarcode,
          saleBarcode: itemDto.saleBarcode,
          productType: itemDto.productType,
          unit: itemDto.unit,
          originalPrice: itemDto.originalPrice,
          salePrice: itemDto.salePrice,
          quantity: itemDto.quantity,
          total: itemDto.salePrice * itemDto.quantity,
          cgst: itemDto.cgst,
          sgst: itemDto.sgst,
          priceIncrease: itemDto.priceIncrease,
        });

        billItems.push(billItem);

        // Update product inventory
        product.quantity -= itemDto.quantity;
        await queryRunner.manager.save(product);
      }

      // Save all bill items
      await queryRunner.manager.save(billItems);

      await queryRunner.commitTransaction();

      // Return the complete bill with items
      if (Array.isArray(savedBill) && savedBill.length > 0) {
        return this.findOne(savedBill[0].id);
      } else if (savedBill && savedBill.id) {
        return this.findOne(savedBill.id);
      } else {
        throw new Error('Failed to save bill');
      }

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(companyId?: string): Promise<Bill[]> {
    const where = companyId ? { company: { id: companyId } } : {};
    return this.billRepository.find({
      where,
      relations: ['company', 'salesman', 'items', 'items.product', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: { id },
      relations: ['company', 'salesman', 'items', 'items.product', 'payments'],
    });
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }
    return bill;
  }

  async findByBillNo(billNo: string): Promise<Bill> {
    const bill = await this.billRepository.findOne({
      where: { billNo },
      relations: ['company', 'salesman', 'items', 'items.product', 'payments'],
    });
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }
    return bill;
  }

  async updateStatus(id: string, status: BillStatus): Promise<Bill> {
    const bill = await this.findOne(id);
    bill.status = status;
    return this.billRepository.save(bill);
  }

  async delete(id: string): Promise<{ message: string }> {
    const bill = await this.findOne(id);
    
    // If bill is completed, restore inventory
    if (bill.status === BillStatus.COMPLETED) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const item of bill.items) {
          const product = await this.productRepository.findOne({ 
            where: { id: item.product.id } 
          });
          if (product) {
            product.quantity += item.quantity;
            await queryRunner.manager.save(product);
          }
        }
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    }

    await this.billRepository.remove(bill);
    return { message: 'Bill deleted successfully' };
  }

  async findAllByCompanyAndDate(companyId: string, date: string): Promise<Bill[]> {
    // Parse the date and get the start and end of the day
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    return this.billRepository.find({
      where: {
        company: { id: companyId },
        date: Between(startOfDay, endOfDay),
      },
      relations: ['company', 'salesman', 'items', 'items.product', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteByBillNo(billNo: string): Promise<{ message: string }> {
    const bill = await this.billRepository.findOne({ where: { billNo }, relations: ['company', 'salesman', 'items', 'items.product'] });
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }
    return this.delete(bill.id);
  }

  /**
   * Returns a commission report for all salesmen for a given company and date (single day).
   * For each salesman: lists their bills, and for each bill, both commission types and the total.
   */
  async getSalesmanCommissionReport(companyId: string, date: string) {
    // Get all bills for the company and date, including salesman and items
    const bills = await this.billRepository.find({
      where: {
        company: { id: companyId },
        date: Between(
          new Date(new Date(date).setHours(0, 0, 0, 0)),
          new Date(new Date(date).setHours(23, 59, 59, 999))
        ),
      },
      relations: ['salesman', 'items'],
      order: { createdAt: 'DESC' },
    });

    // Group bills by salesman
    const report: Record<string, any> = {};
    for (const bill of bills) {
      if (!bill.salesman) continue;
      const salesmanId = bill.salesman.id;
      if (!report[salesmanId]) {
        report[salesmanId] = {
          salesman: {
            id: bill.salesman.id,
            name: bill.salesman.name,
            commissionRate: Number(bill.salesman.commissionRate),
          },
          bills: [],
          totalCommission1: 0,
          totalCommission2: 0,
          totalCommission: 0,
        };
      }
      // Commission type 1: finalTotal * commissionRate / 100
      const commission1 = Number(bill.finalTotal || bill.grandTotal) * (Number(bill.salesman.commissionRate) / 100);
      // Commission type 2: 25% of (total priceIncrease - discountAmount if both present)
      let totalPriceIncrease = 0;
      let hasPriceIncrease = false;
      for (const item of bill.items) {
        if (Number(item.priceIncrease) > 0) {
          hasPriceIncrease = true;
          totalPriceIncrease += Number(item.priceIncrease) * Number(item.quantity);
        }
      }
      let commission2 = 0;
      if (hasPriceIncrease) {
        let adjustedIncrease = totalPriceIncrease;
        if (bill.discountAmount && Number(bill.discountAmount) > 0) {
          adjustedIncrease = Math.max(0, totalPriceIncrease - Number(bill.discountAmount));
        }
        commission2 = adjustedIncrease * 0.25;
      }
      const totalCommission = commission1 + commission2;
      report[salesmanId].bills.push({
        billId: bill.id,
        billNo: bill.billNo,
        grandTotal: Number(bill.grandTotal),
        finalTotal: Number(bill.finalTotal || bill.grandTotal),
        commission1,
        commission2,
        totalCommission,
      });
      report[salesmanId].totalCommission1 += commission1;
      report[salesmanId].totalCommission2 += commission2;
      report[salesmanId].totalCommission += totalCommission;
    }
    return Object.values(report);
  }
} 