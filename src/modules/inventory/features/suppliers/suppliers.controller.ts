import {
  Body,
  Controller,
  Get,
  Req,
  Param,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { saveBodySchema } from 'src/modules/inventory/interfaces/validation.interface';
import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';

@Controller('api')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post('suppliers')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  supplier(@Body() b: any, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.suppliersService.save(b, Number(cookieData?.user_id));
  }

  @Get('suppliers')
  suppliers(@Query() q: any) {
    return this.suppliersService.list(q.shop_id);
  }

  @Get('suppliers/:phone')
  supplierByPhone(@Param('phone') phone: string) {
    return this.suppliersService.supplierByPhone(phone);
  }
}
