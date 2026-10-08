import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { ShopService } from './shop.service';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  saveShopSchema,
  type SaveShopInput,
} from 'src/modules/configuration/interfaces/validation.interface';

@Controller()
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('shop')
  shops(@Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.shopService.list(cookieData?.company_id);
  }

  @Post('create-update-shop')
  @UsePipes(new ZodValidationPipe(saveShopSchema))
  saveShop(@Body() body: SaveShopInput, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.shopService.save(body, Number(cookieData?.user_id));
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
