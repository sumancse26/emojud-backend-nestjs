import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { DesignationsService } from './designations.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/hr/interfaces/validation.interface';

@Controller('api')
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Get('designation')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  designations(@Query() q: any) {
    return this.designationsService.list(q);
  }

  @Post('designation')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveDesignation(@Body() b: any) {
    return this.designationsService.save(b);
  }
}
