import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/configuration/interfaces/validation.interface';

@Controller('api')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('warehouse')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  warehouses(@Query() q: any) {
    return this.warehouseService.list(q);
  }

  @Post('warehouse')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveWarehouse(@Body() b: any) {
    return this.warehouseService.save(b);
  }
}
