import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('api')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('invoice')
  invoices(@Query() q: any) {
    return this.invoicesService.list(q);
  }

  @Get('invoice/:id')
  invoice(@Param('id') id: string) {
    return this.invoicesService.detail(id);
  }

  @Post('invoice')
  saveInvoice(@Body() b: any) {
    return this.invoicesService.save(b);
  }
}
