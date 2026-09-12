import {
  Body,
  Controller,
  Get,
  Req,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { SupplierPaymentService } from './supplier-payment.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  listQuerySchema,
  saveBodySchema,
} from 'src/modules/accounts/interfaces/validation.interface';

import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';
@Controller()
export class SupplierPaymentController {
  constructor(
    private readonly supplierPaymentService: SupplierPaymentService,
  ) {}

  @Get('supplier-payment')
  supplierPayments(@Query() q: any) {
    return this.supplierPaymentService.list(Number(q?.shop_id));
  }

  @Get('supplier-payment-due')
  supplierPaymentDue(@Query() q: any) {
    return this.supplierPaymentService.dueList(Number(q?.shop_id));
  }

  @Get('supplier-payment-pending-due')
  pendingDueList(@Query() q: any) {
    return this.supplierPaymentService.pendingDueList(Number(q?.shop_id));
  }

  @Post('supplier-payment')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveSupplierPayment(@Body() b: any, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.supplierPaymentService.save(b, Number(cookieData?.user_id));
  }
}
