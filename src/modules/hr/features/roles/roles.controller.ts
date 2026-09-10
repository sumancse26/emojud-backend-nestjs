import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { saveBodySchema } from 'src/modules/hr/interfaces/validation.interface';
import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';

@Controller('api')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('role')
  roles(@Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.rolesService.list(Number(cookieData?.company_id));
  }

  @Post('role')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveRole(@Body() b: any, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.rolesService.save(b, {
      company_id: cookieData?.company_id,
      user_id: cookieData?.user_id,
    });
  }
}
