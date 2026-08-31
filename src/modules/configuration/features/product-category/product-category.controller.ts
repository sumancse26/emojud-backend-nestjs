import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/configuration/interfaces/validation.interface';

@Controller('api')
export class ProductCategoryController {
  constructor(private readonly categoryService: ProductCategoryService) {}

  @Get('product-category')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  categories(@Query() q: any) {
    return this.categoryService.list(q);
  }

  @Post('product-category')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveCategory(@Body() b: any) {
    return this.categoryService.save(b);
  }
}
