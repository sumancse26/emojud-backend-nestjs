import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  summary(@Query('shop_id', ParseIntPipe) shopId: number) {
    return this.service.summary(shopId);
  }

  @Get('recent-operations')
  recent(@Query('shop_id', ParseIntPipe) shopId: number) {
    return this.service.recent(shopId);
  }

  @Get('overview')
  overview(@Query('shop_id', ParseIntPipe) shopId: number) {
    return this.service.overview(shopId);
  }

  @Get('stock-overview')
  stockOverview(@Query('shop_id', ParseIntPipe) shopId: number) {
    return this.service.stockOverview(shopId);
  }

  @Get('monthly-summary')
  monthlySummary(@Query('shop_id', ParseIntPipe) shopId: number) {
    return this.service.monthlySummary(shopId);
  }
}
