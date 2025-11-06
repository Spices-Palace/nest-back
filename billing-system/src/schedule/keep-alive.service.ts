import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class KeepAliveService {
  private readonly logger = new Logger(KeepAliveService.name);

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  /**
   * Method 1: Using Interval (Recommended if server runs continuously)
   * Runs every 5 days (432,000,000 milliseconds = 5 days)
   * This is the most accurate for "every 5 days" timing
   */
  @Interval(432000000) // 5 days in milliseconds: 5 * 24 * 60 * 60 * 1000
  async handleKeepAliveInterval() {
    this.logger.log('Executing Supabase keep-alive ping (every 5 days)...');
    
    try {
      // Simple query to keep the database connection active
      await this.dataSource.query('SELECT 1');
      this.logger.log('Supabase keep-alive ping successful');
    } catch (error) {
      this.logger.error('Failed to ping Supabase:', error.message);
    }
  }

  /**
   * Method 2: Using Cron (Alternative - runs on specific days of month)
   * Runs approximately every 5 days on days 1, 6, 11, 16, 21, 26 of each month at 2:00 AM UTC
   * This works better if your server restarts frequently
   * 
   * Note: Uncomment this and comment out the @Interval method above if you prefer cron-based scheduling
   */
  // @Cron('0 2 1,6,11,16,21,26 * *', {
  //   name: 'supabase-keep-alive-5days',
  //   timeZone: 'UTC',
  // })
  // async handleKeepAliveCron() {
  //   this.logger.log('Executing Supabase keep-alive ping (every 5 days via cron)...');
  //   
  //   try {
  //     await this.dataSource.query('SELECT 1');
  //     this.logger.log('Supabase keep-alive ping successful');
  //   } catch (error) {
  //     this.logger.error('Failed to ping Supabase:', error.message);
  //   }
  // }
}

