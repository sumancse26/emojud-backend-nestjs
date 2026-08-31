import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CustomerDueService } from './customer-due.service';

@Controller('api')
export class CustomerDueController {
  constructor(private readonly customerDueService: CustomerDueService) {}

  @Get('customer-due')
  customerDues(@Query() q: any) {
    return this.customerDueService.list(q);
  }

  @Post('customer-due')
  saveCustomerDue(@Body() b: any) {
    return this.customerDueService.save(b);
  }
}
