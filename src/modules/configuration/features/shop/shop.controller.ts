import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ShopService } from './shop.service';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';

@Controller('api')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('shop')
  shops(@Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.shopService.list(cookieData?.company_id);
  }

  @Get('user-wise-shop')
  userShops(@Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.shopService.userShopList(
      Number(cookieData?.company_id),
      Number(cookieData?.user_id),
    );
  }
}
