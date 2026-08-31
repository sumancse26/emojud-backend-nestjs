import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { StockSummaryService } from './stock-summary.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { idParamSchema, listQuerySchema } from 'src/modules/stock-management/interfaces/validation.interface';

@Controller('api')
export class StockSummaryController {
  constructor(private readonly stockSummaryService: StockSummaryService) {}

  @Get('stock-summary')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  stock(@Query() q: any) {
    return this.stockSummaryService.list(q);
  }

  @Get('stock-summary/:id')
  stockDetail(@Param('id', new ZodValidationPipe(idParamSchema)) id: string) {
    return this.stockSummaryService.detail(id);
  }
}
