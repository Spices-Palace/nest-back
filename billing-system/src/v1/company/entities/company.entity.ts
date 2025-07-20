import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
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

  @OneToMany(() => Salesman, salesman => salesman.company)
  salesmen: Salesman[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 