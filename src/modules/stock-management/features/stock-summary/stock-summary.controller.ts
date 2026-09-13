import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { StockSummaryService } from './stock-summary.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  StockQuerySchema,
  StockDetailsSchema,
  type stockQueryType,
  type stockDetailsType,
} from './dto/stock-summary.dto';

@Controller()
export class StockSummaryController {
  constructor(private readonly stockSummaryService: StockSummaryService) {}

  @Get('stock-summary')
  @UsePipes(new ZodValidationPipe(StockQuerySchema))
  stock(@Query() q: stockQueryType) {
    return this.stockSummaryService.list(q.shop_id);
  }

  @Get('stock-summary-detail')
  @UsePipes(new ZodValidationPipe(StockDetailsSchema))
  stockDetail(@Query() q: stockDetailsType) {
    return this.stockSummaryService.detail(q);
  }
}
