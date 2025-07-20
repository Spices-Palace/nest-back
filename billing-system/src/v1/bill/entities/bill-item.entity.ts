import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Bill } from './bill.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class BillItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Bill, bill => bill.items, { onDelete: 'CASCADE' })
  bill: Bill;

  @ManyToOne(() => Product, { nullable: false })
  product: Product;

  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @Column({ type: 'varchar', length: 255 })
  originalBarcode: string;

  @Column({ type: 'varchar', length: 255 })
  saleBarcode: string;

  @Column({ type: 'varchar', length: 255 })
  productType: string;

  @Column({ type: 'varchar', length: 255 })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  originalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salePrice: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cgst: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sgst: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceIncrease: number;

  @CreateDateColumn()
  createdAt: Date;
} 