import { Controller, Get, Param, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('api/report')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get(':type')
  report(@Param('type') type: string, @Query() q: any) {
    return this.service.report(type, q);
  }
}
