import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SalaryService } from './salary.service';

@Controller('api')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get('salary-process')
  salaryProcesses(@Query() q: any) {
    return this.salaryService.list(q);
  }

  @Get('salary-process/:id')
  salaryProcessDetail(@Param('id') id: string) {
    return this.salaryService.detail(id);
  }

  @Post('salary-process')
  saveSalaryProcess(@Body() b: any) {
    return this.salaryService.save(b);
  }
}
