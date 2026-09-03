import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  ParseIntPipe,
  UsePipes,
  Param,
} from '@nestjs/common';
import { UserShopPermissionService } from './user-shop-permission.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { saveBodySchema } from 'src/modules/configuration/interfaces/validation.interface';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';
import type { Request } from 'express';

@Controller('api')
export class UserShopPermissionController {
  constructor(private readonly permissionService: UserShopPermissionService) {}

  @Get('user-wise-permission')
  permissions(@Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.permissionService.list({
      user_id: cookieData?.user_id,
      company_id: cookieData?.company_id,
    });
  }

  @Post('user-wise-permission')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  savePermissions(@Body() b: any, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.permissionService.saveBatch(
      b.data ?? [],
      Number(cookieData?.user_id),
    );
  }
}
