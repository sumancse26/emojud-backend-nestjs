import { Body, Controller, Get, Post, Query, Req, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { EmployeeService } from './employee.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  listQuerySchema,
  createEmployeeSchema,
} from 'src/modules/hr/interfaces/validation.interface';
import type { CreateEmployeeInput } from 'src/modules/hr/interfaces/validation.interface';
import { getClientIp, getClientMac } from 'src/common/utils/device-info.util';

@Controller('api')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('employees')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
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
