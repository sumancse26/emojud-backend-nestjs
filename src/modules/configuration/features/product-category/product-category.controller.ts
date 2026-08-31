import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';

@Controller('api')
export class ProductCategoryController {
  constructor(private readonly categoryService: ProductCategoryService) {}

  @Get('product-category')
  categories(@Query() q: any) {
    return this.categoryService.list(q);
  }

  @Post('product-category')
  saveCategory(@Body() b: any) {
    return this.categoryService.save(b);
  }
}
