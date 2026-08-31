import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';

@Controller('api')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post('expense')
  expense(@Body() b: any) {
    return this.expensesService.save(b);
  }

  @Get('expense')
  expenses(@Query() q: any) {
    return this.expensesService.list(q);
  }

  @Get('expense/:id')
  expenseDetail(@Param('id') id: string) {
    return this.expensesService.detail(id);
  }
}
