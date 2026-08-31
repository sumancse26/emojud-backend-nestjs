import { Controller, Get, Param, Query, UsePipes } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema } from 'src/modules/reports/interfaces/validation.interface';

@Controller('api/report')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get(':type')
  report(
    @Param('type') type: string,
    @Query(new ZodValidationPipe(listQuerySchema)) q: any,
  ) {
    return this.service.report(type, q);
  }
}
