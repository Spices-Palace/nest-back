import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn
} from 'typeorm';
// Adjust import paths as needed
// import { User } from '../user/user.entity';
import { Company } from '../company/entities/company.entity';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  reportDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalSales: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalProfit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalExpenses: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCommissions: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  driverCommissions: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  salespersonCommissions: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalDiscounts: number;

  @Column({ type: 'int', default: 0 })
  totalTransactions: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'created_by' })
  // createdBy: User;

  @Column({ name: 'created_by', nullable: true })
  createdById: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id' })
  companyId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 