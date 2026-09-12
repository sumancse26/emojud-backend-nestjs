import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { saveBodySchema } from 'src/modules/inventory/interfaces/validation.interface';
import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';

@Controller()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('customers')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  customer(@Body() b: any, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.customersService.save(b, Number(cookieData?.user_id));
  }

  @Get('customers')
  customers(@Query() q: any) {
    return this.customersService.list(q);
  }

  @Get('customers/:phone')
  customerByPhone(@Param('phone') phone: string) {
    return this.customersService.customerByPhone(phone);
  }
}
