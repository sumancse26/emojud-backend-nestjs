import { Controller, Get, Query } from '@nestjs/common';
import { LookupService } from './lookup.service';

@Controller('api/common')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Get('lookup')
  getCommonList(@Query('ids') ids: string) {
    const idArray: number[] = JSON.parse(ids);
    return this.lookupService.commonList(idArray);
  }
}
