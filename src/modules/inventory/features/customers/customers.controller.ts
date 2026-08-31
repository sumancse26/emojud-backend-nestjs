import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('api')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('customers')
  customer(@Body() b: any) {
    return this.customersService.save(b);
  }

  @Get('customers')
  customers(@Query() q: any) {
    return this.customersService.list(q);
  }

  @Get('customers/:phone')
  customerByPhone(@Param('phone') phone: string) {
    return this.customersService.list({ phone });
  }
}
