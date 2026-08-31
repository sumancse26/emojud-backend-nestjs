import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { CommissionProfitService } from './commission-profit.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/accounts/interfaces/validation.interface';

@Controller('api')
export class CommissionProfitController {
  constructor(private readonly commissionProfitService: CommissionProfitService) {}

  @Get('commission-profit')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  commissionProfits(@Query() q: any) {
    return this.commissionProfitService.list(q);
  }

  @Post('commission-profit')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveCommissionProfit(@Body() b: any) {
    return this.commissionProfitService.save(b);
  }
}
