import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { idParamSchema, listQuerySchema, saveBodySchema } from 'src/modules/stock-management/interfaces/validation.interface';

@Controller('api')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get('purchase')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  purchases(@Query() q: any) {
    return this.purchasesService.list(q);
  }

  @Get('purchase/:id')
  purchase(@Param('id', new ZodValidationPipe(idParamSchema)) id: string) {
    return this.purchasesService.detail(id);
  }

  @Post('purchase')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  savePurchase(@Body() b: any) {
    return this.purchasesService.save(b);
  }
}
