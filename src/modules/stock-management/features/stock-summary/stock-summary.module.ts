import { Module } from '@nestjs/common';
import { StockSummaryController } from './stock-summary.controller';
import { StockSummaryService } from './stock-summary.service';

@Module({
  controllers: [StockSummaryController],
  providers: [StockSummaryService],
  exports: [StockSummaryService],
})
export class StockSummaryModule {}
