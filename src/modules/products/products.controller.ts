import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/products/interfaces/validation.interface';

@Controller('api')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  products(@Query() q: any) {
    return this.productsService.list(q);
  }

  @Post('products')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  createProduct(@Body() b: any) {
    return this.productsService.save(b);
  }

  @Get('shop-wise-products')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  shopProducts(@Query() q: any) {
    return this.productsService.list(q);
  }
}
