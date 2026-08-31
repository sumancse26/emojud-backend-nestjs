import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/hr/interfaces/validation.interface';

@Controller('api')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get('departments')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  departments(@Query() q: any) {
    return this.departmentsService.list(q);
  }

  @Post('departments')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveDepartment(@Body() b: any) {
    return this.departmentsService.save(b);
  }
}
