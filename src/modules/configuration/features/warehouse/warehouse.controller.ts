import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  saveWarehouseSchema,
  type SaveWarehouseInput,
} from 'src/modules/configuration/interfaces/validation.interface';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';
import type { Request } from 'express';

@Controller('api')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('warehouse')
  warehouses(@Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.warehouseService.list(Number(cookieData?.company_id));
  }

  @Post('warehouse')
  @UsePipes(new ZodValidationPipe(saveWarehouseSchema))
  saveWarehouse(@Body() b: SaveWarehouseInput, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.warehouseService.save(b, Number(cookieData?.user_id));
  }
}
