import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SupplierPaymentService } from './supplier-payment.service';

@Controller('api')
export class SupplierPaymentController {
  constructor(private readonly supplierPaymentService: SupplierPaymentService) {}

  @Get('supplier-payment')
  supplierPayments(@Query() q: any) {
    return this.supplierPaymentService.list(q);
  }

  @Post('supplier-payment')
  saveSupplierPayment(@Body() b: any) {
    return this.supplierPaymentService.save(b);
  }
}
