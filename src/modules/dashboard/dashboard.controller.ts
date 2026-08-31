import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  summary() {
    return this.service.summary();
  }

  @Get('recent-operations')
  recent() {
    return this.service.recent();
  }

  @Get('overview')
  overview() {
    return this.service.overview();
  }

  @Get('stock-overview')
  stockOverview() {
    return this.service.stockOverview();
  }
}
