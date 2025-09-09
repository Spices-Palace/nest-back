import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Salesman } from '../../salesman/entities/salesman.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  companyName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  gmail: string;

  @Column({ type: 'varchar', length: 255 })
  adminPassword: string;

  @Column({ type: 'varchar', length: 255 })
  cashierPassword: string;

  // optional fields
  @Column({ name: 'gst_number', type: 'varchar', length: 20, nullable: true })
  gstNumber?: string | null;

  @Column({ name: 'address', type: 'text', nullable: true })
  address?: string | null;

  @OneToMany(() => Salesman, (salesman) => salesman.company)
  salesmen: Salesman[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 