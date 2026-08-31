import { Body, Controller, Get, Param, Post, Query, UsePipes } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema, textParamSchema } from 'src/modules/inventory/interfaces/validation.interface';

@Controller('api')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post('suppliers')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  supplier(@Body() b: any) {
    return this.suppliersService.save(b);
  }

  @Get('suppliers')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  suppliers(@Query() q: any) {
    return this.suppliersService.list(q);
  }

  @Get('suppliers/:phone')
  supplierByPhone(@Param('phone', new ZodValidationPipe(textParamSchema)) phone: string) {
    return this.suppliersService.list({ phone });
  }
}
