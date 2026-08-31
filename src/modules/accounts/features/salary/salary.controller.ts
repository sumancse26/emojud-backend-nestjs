import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { SalaryService } from './salary.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { idParamSchema, listQuerySchema, saveBodySchema } from 'src/modules/accounts/interfaces/validation.interface';

@Controller('api')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get('salary-process')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  salaryProcesses(@Query() q: any) {
    return this.salaryService.list(q);
  }

  @Get('salary-process/:id')
  salaryProcessDetail(@Param('id', new ZodValidationPipe(idParamSchema)) id: string) {
    return this.salaryService.detail(id);
  }

  @Post('salary-process')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveSalaryProcess(@Body() b: any) {
    return this.salaryService.save(b);
  }
}
