import { Controller, Get, Param, Query } from '@nestjs/common';
import { StockSummaryService } from './stock-summary.service';

@Controller('api')
export class StockSummaryController {
  constructor(private readonly stockSummaryService: StockSummaryService) {}

  @Get('stock-summary')
  stock(@Query() q: any) {
    return this.stockSummaryService.list(q);
  }

  @Get('stock-summary/:id')
  stockDetail(@Param('id') id: string) {
    return this.stockSummaryService.detail(id);
  }
}
