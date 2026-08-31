import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { CustomerDueService } from './customer-due.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/accounts/interfaces/validation.interface';

@Controller('api')
export class CustomerDueController {
  constructor(private readonly customerDueService: CustomerDueService) {}

  @Get('customer-due')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  customerDues(@Query() q: any) {
    return this.customerDueService.list(q);
  }

  @Post('customer-due')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveCustomerDue(@Body() b: any) {
    return this.customerDueService.save(b);
  }
}
