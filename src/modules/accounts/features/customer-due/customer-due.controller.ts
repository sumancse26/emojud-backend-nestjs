import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Query,
  UsePipes,
} from '@nestjs/common';
import { CustomerDueService } from './customer-due.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  CustomerDueSchema,
  type customerDueType,
} from './dto/customer-due.dto';
import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';

@Controller()
export class CustomerDueController {
  constructor(private readonly customerDueService: CustomerDueService) {}

  @Get('customer-due')
  customerDues(@Query() q: any) {
    return this.customerDueService.list(Number(q.shop_id));
  }

  @Get('customer-due-pending')
  customerPendingDues(@Query() q: any) {
    return this.customerDueService.pendingDueList(Number(q.shop_id));
  }

  @Get('invoice-wise-customer-due')
  invoiceWiseCustomerDue(@Query() q: any) {
    return this.customerDueService.invoiceDueList(Number(q.shop_id));
  }

  @Post('customer-due')
  @UsePipes(new ZodValidationPipe(CustomerDueSchema))
  saveCustomerDue(@Body() b: customerDueType, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.customerDueService.save(b, Number(cookieData?.user_id));
  }
}
