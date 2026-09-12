import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { saveBodySchema } from 'src/modules/hr/interfaces/validation.interface';
import type { Request } from 'express';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';
import { decodeCookie } from 'src/common/utils/cookie.util';

@Controller()
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get('departments')
  departments(@Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.departmentsService.list(Number(cookieData?.company_id));
  }

  @Post('departments')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveDepartment(@Body() b: any, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.departmentsService.save(
      b,
      Number(cookieData?.company_id),
      Number(cookieData?.user_id),
    );
  }
}
