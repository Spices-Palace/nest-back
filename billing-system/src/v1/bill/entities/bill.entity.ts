import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Salesman } from '../../salesman/entities/salesman.entity';
import { BillItem } from './bill-item.entity';
import { BillPayment } from './bill-payment.entity';

export enum BillStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  CUSTOM = 'custom',
}

@Entity()
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  billNo: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'varchar', length: 255 })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  salesmanName: string;

  @ManyToOne(() => Company, { nullable: false })
  company: Company;

  @ManyToOne(() => Salesman, { nullable: true })
  salesman: Salesman | null;

  @OneToMany(() => BillItem, billItem => billItem.bill, { cascade: true })
  items: BillItem[];

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalCGST: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalSGST: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  grandTotal: number;

  @Column({ type: 'enum', enum: BillStatus, default: BillStatus.PENDING })
  status: BillStatus;

  @Column({ type: 'enum', enum: DiscountType, default: DiscountType.PERCENTAGE })
  discountType: DiscountType;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  discountValue: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  finalTotal: number;

  @OneToMany(() => BillPayment, (payment) => payment.bill, { cascade: true })
  payments: BillPayment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 