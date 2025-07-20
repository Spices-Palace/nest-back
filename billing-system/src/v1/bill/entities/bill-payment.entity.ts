import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Bill } from './bill.entity';

export enum PaymentMethod {
  CASH = 'Cash',
  UPI = 'UPI',
  CARD = 'Card',
  OTHER = 'Other',
}

@Entity()
export class BillPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @ManyToOne(() => Bill, (bill) => bill.payments, { onDelete: 'CASCADE' })
  bill: Bill;
} 