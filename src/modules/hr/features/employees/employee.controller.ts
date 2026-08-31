import { Body, Controller, Get, Post, Query, Req, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { EmployeeService } from './employee.service';
import { createEmployeeSchema } from './interfaces/create-employee.interface';
import type { CreateEmployeeInput } from './interfaces/create-employee.interface';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { getClientIp, getClientMac } from 'src/common/utils/device-info.util';

@Controller('api')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('employees')
  async list(@Query() q: any) {
    return await this.employeeService.list(q);
  }

  @Post('employee/create')
  @UsePipes(new ZodValidationPipe(createEmployeeSchema))
  async create(@Body() input: CreateEmployeeInput, @Req() req: Request) {
    const ip = getClientIp(req);
    const mac = getClientMac(req);
    return await this.employeeService.createEmployee(input, {
      ip,
      mac,
    });
  }
}
