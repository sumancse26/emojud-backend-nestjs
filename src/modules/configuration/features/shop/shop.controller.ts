import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { ShopService } from './shop.service';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';
import { saveBodySchema } from 'src/modules/configuration/interfaces/validation.interface';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';

@Controller('api')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('shop')
  shops(@Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.shopService.list(cookieData?.company_id);
  }

  @Post('shop')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveShop(@Req() req: Request, @Body() b: any) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.shopService.save({
      ...b,
      login_user_id: b.login_user_id ?? cookieData?.user_id,
    });
  }
}
