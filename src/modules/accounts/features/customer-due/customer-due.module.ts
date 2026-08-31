import { Module } from '@nestjs/common';
import { CustomerDueController } from './customer-due.controller';
import { CustomerDueService } from './customer-due.service';

@Module({
  controllers: [CustomerDueController],
  providers: [CustomerDueService],
  exports: [CustomerDueService],
})
export class CustomerDueModule {}
