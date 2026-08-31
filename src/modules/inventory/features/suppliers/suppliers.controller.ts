import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';

@Controller('api')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post('suppliers')
  supplier(@Body() b: any) {
    return this.suppliersService.save(b);
  }

  @Get('suppliers')
  suppliers(@Query() q: any) {
    return this.suppliersService.list(q);
  }

  @Get('suppliers/:phone')
  supplierByPhone(@Param('phone') phone: string) {
    return this.suppliersService.list({ phone });
  }
}
