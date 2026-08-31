import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema, textParamSchema } from 'src/modules/inventory/interfaces/validation.interface';

@Controller('api')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('customers')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  customer(@Body() b: any) {
    return this.customersService.save(b);
  }

  @Get('customers')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  customers(@Query() q: any) {
    return this.customersService.list(q);
  }

  @Get('customers/:phone')
  customerByPhone(@Param('phone', new ZodValidationPipe(textParamSchema)) phone: string) {
    return this.customersService.list({ phone });
  }
}
