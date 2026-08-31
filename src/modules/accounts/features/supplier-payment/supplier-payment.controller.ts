import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { SupplierPaymentService } from './supplier-payment.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/accounts/interfaces/validation.interface';

@Controller('api')
export class SupplierPaymentController {
  constructor(private readonly supplierPaymentService: SupplierPaymentService) {}

  @Get('supplier-payment')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  supplierPayments(@Query() q: any) {
    return this.supplierPaymentService.list(q);
  }

  @Post('supplier-payment')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveSupplierPayment(@Body() b: any) {
    return this.supplierPaymentService.save(b);
  }
}
