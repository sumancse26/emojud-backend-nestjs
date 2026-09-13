import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  Req,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  type PurchaseQueryType,
  PurchaseQuerySchema,
  PurchaseSchema,
  type purchaseType,
} from './dto/purchase.dto';
import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';

@Controller()
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get('purchase')
  @UsePipes(new ZodValidationPipe(PurchaseQuerySchema))
  purchases(@Query() q: PurchaseQueryType) {
    return this.purchasesService.list(q.shop_id);
  }

  @Get('purchase-details')
  @UsePipes(new ZodValidationPipe(PurchaseQuerySchema))
  purchase(@Query() q: PurchaseQueryType) {
    return this.purchasesService.detail(q.id, q.shop_id);
  }

  @Post('purchase')
  @UsePipes(new ZodValidationPipe(PurchaseSchema))
  savePurchase(@Body() b: purchaseType, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.purchasesService.save(b, cookieData?.user_id);
  }
}
