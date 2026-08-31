import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShopService } from './shop.service';

@Controller('api')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('shop')
  shops(@Query() q?: any) {
    return this.shopService.list(q);
  }

  @Post('shop')
  saveShop(@Body() b: any) {
    return this.shopService.save(b);
  }
}
