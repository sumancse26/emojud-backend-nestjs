import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { idParamSchema, listQuerySchema, saveBodySchema } from 'src/modules/accounts/interfaces/validation.interface';

@Controller('api')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post('expense')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  expense(@Body() b: any) {
    return this.expensesService.save(b);
  }

  @Get('expense')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  expenses(@Query() q: any) {
    return this.expensesService.list(q);
  }

  @Get('expense/:id')
  expenseDetail(@Param('id', new ZodValidationPipe(idParamSchema)) id: string) {
    return this.expensesService.detail(id);
  }
}
