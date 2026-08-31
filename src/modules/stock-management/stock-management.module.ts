import { Module } from '@nestjs/common';
import { PurchasesModule } from './features/purchases/purchases.module';
import { StockSummaryModule } from './features/stock-summary/stock-summary.module';

@Module({
  imports: [PurchasesModule, StockSummaryModule],
  exports: [PurchasesModule, StockSummaryModule],
})
export class StockManagementModule {}
