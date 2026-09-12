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
import { ExpensesService } from './expenses.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  idParamSchema,
  listQuerySchema,
  saveBodySchema,
} from 'src/modules/accounts/interfaces/validation.interface';
import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';

@Controller()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post('expense')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  expense(@Body() b: any, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);

    return this.expensesService.save(b, Number(cookieData?.user_id));
  }

  @Get('expense')
  expenses(@Query() q: any) {
    return this.expensesService.list(Number(q.shop_id));
  }

  @Get('expense/:expense_id')
  expenseDetail(
    @Param('expense_id', new ZodValidationPipe(idParamSchema))
    expense_id: string,
  ) {
    return this.expensesService.detail(Number(expense_id));
  }
}
