import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Company } from '../../company/entities/company.entity';

@Entity()
@Unique(['id'])
export class Salesman {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  commissionRate: number;

  @ManyToOne(() => Company, company => company.salesmen, { nullable: false, onDelete: 'CASCADE' })
  company: Company;
} 