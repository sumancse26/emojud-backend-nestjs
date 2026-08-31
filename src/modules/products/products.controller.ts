import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  products(@Query() q: any) {
    return this.productsService.list(q);
  }

  @Post('products')
  createProduct(@Body() b: any) {
    return this.productsService.save(b);
  }

  @Get('shop-wise-products')
  shopProducts(@Query() q: any) {
    return this.productsService.list(q);
  }
}
