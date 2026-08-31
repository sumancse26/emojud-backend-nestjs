import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';

@Controller('api')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get('purchase')
  purchases(@Query() q: any) {
    return this.purchasesService.list(q);
  }

  @Get('purchase/:id')
  purchase(@Param('id') id: string) {
    return this.purchasesService.detail(id);
  }

  @Post('purchase')
  savePurchase(@Body() b: any) {
    return this.purchasesService.save(b);
  }
}
