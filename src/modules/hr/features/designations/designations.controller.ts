import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DesignationsService } from './designations.service';

@Controller('api')
export class DesignationsController {
  constructor(private readonly designationsService: DesignationsService) {}

  @Get('designation')
  designations(@Query() q: any) {
    return this.designationsService.list(q);
  }

  @Post('designation')
  saveDesignation(@Body() b: any) {
    return this.designationsService.save(b);
  }
}
