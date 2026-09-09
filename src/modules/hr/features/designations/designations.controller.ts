import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { saveBodySchema } from 'src/modules/hr/interfaces/validation.interface';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { Request } from 'express';

@Controller('api')
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Get('designation')
  designations(@Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.designationsService.list(Number(cookieData?.company_id));
  }

  @Post('designation')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveDesignation(@Body() b: any, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.designationsService.save(b, {
      companyId: cookieData?.company_id,
      userId: cookieData?.user_id,
    });
  }
}
