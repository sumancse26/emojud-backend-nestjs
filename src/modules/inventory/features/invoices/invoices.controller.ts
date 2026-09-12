import {
  Body,
  Controller,
  Get,
  Req,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { saveBodySchema } from 'src/modules/inventory/interfaces/validation.interface';
import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('invoice')
  invoices(@Query() q: any) {
    return this.invoicesService.list(q.shop_id);
  }

  @Get('invoice-details')
  invoice(@Query() q: any) {
    return this.invoicesService.detail({
      inv_id: q.inv_id,
      shop_id: q.shop_id,
    });
  }

  @Post('invoice')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveInvoice(@Body() b: any, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.invoicesService.save(b, Number(cookieData?.user_id));
  }
}
