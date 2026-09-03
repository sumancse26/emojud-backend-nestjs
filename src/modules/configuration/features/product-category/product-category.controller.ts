import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ProductCategoryService } from './product-category.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  productCategorySchema,
  saveBodySchema,
} from 'src/modules/configuration/interfaces/validation.interface';
import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from 'src/modules/auth/jwt/jwt.service';

@Controller('api')
export class ProductCategoryController {
  constructor(private readonly categoryService: ProductCategoryService) {}

  @Get('product-category')
  @UsePipes(new ZodValidationPipe(productCategorySchema))
  categories(@Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.categoryService.list(Number(cookieData?.company_id));
  }
  @Get('product-sub-category/:categoryId')
  subCategories(
    @Req() req: Request,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.categoryService.subCategoryList(
      categoryId,
      Number(cookieData?.company_id),
    );
  }

  @Post('product-category')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveCategory(@Body() b: any) {
    return this.categoryService.save(b);
  }
}
