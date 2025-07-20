import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Buyer } from '../../buyer/entities/buyer.entity';
import { Company } from '../../company/entities/company.entity';
import { SalePrice } from './sale-price.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @Column({ type: 'varchar', length: 255 })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  barcode: string;

  @ManyToOne(() => Buyer, { nullable: false })
  buyer: Buyer;

  @ManyToOne(() => Company, { nullable: false })
  company: Company;

  @OneToMany(() => SalePrice, salePrice => salePrice.product, { cascade: true })
  salePrices: SalePrice[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 