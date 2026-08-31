import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommissionProfitService } from './commission-profit.service';

@Controller('api')
export class CommissionProfitController {
  constructor(private readonly commissionProfitService: CommissionProfitService) {}

  @Get('commission-profit')
  commissionProfits(@Query() q: any) {
    return this.commissionProfitService.list(q);
  }

  @Post('commission-profit')
  saveCommissionProfit(@Body() b: any) {
    return this.commissionProfitService.save(b);
  }
}
