import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';

@Controller('api')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('warehouse')
  warehouses(@Query() q: any) {
    return this.warehouseService.list(q);
  }

  @Post('warehouse')
  saveWarehouse(@Body() b: any) {
    return this.warehouseService.save(b);
  }
}
