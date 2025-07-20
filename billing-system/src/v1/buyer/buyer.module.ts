import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
  providers: [BuyerService],
  controllers: [BuyerController],
})
export class BuyerModule {} 