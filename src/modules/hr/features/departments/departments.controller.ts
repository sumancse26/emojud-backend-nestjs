import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DepartmentsService } from './departments.service';

@Controller('api')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get('departments')
  departments(@Query() q: any) {
    return this.departmentsService.list(q);
  }

  @Post('departments')
  saveDepartment(@Body() b: any) {
    return this.departmentsService.save(b);
  }
}
