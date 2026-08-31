import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { idParamSchema, listQuerySchema, saveBodySchema } from 'src/modules/inventory/interfaces/validation.interface';

@Controller('api')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('invoice')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  invoices(@Query() q: any) {
    return this.invoicesService.list(q);
  }

  @Get('invoice/:id')
  invoice(@Param('id', new ZodValidationPipe(idParamSchema)) id: string) {
    return this.invoicesService.detail(id);
  }

  @Post('invoice')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveInvoice(@Body() b: any) {
    return this.invoicesService.save(b);
  }
}
