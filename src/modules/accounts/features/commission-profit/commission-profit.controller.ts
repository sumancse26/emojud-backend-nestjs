import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CommissionProfitService } from './commission-profit.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';
import {
  type commissionProfitType,
  CommissionProfitSchema,
} from './dto/commission-profit.dto';

@Controller()
export class CommissionProfitController {
  constructor(
    private readonly commissionProfitService: CommissionProfitService,
  ) {}

  @Get('shop-wise-commission-profit')
  commissionProfits(@Query() q: any) {
    return this.commissionProfitService.list(Number(q.shop_id));
  }

  @Post('shop-wise-commission-profit')
  @UsePipes(new ZodValidationPipe(CommissionProfitSchema))
  saveCommissionProfit(@Body() b: commissionProfitType, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.commissionProfitService.save(b, Number(cookieData?.user_id));
  }
}
