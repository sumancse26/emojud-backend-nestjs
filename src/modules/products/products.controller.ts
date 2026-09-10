import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  listQuerySchema,
  saveBodySchema,
} from 'src/modules/products/interfaces/validation.interface';
import type { Request } from 'express';
import { decodeCookie } from 'src/common/utils/cookie.util';
import type { RefreshTokenPayload } from '../auth/jwt/jwt.service';

@Controller('api')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  products(@Query() q: any) {
    return this.productsService.list(Number(q.shop_id));
  }

  @Post('products')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  createProduct(@Body() b: any, @Req() req: Request) {
    const cookieData = decodeCookie<RefreshTokenPayload>(req);
    return this.productsService.save(b, Number(cookieData?.user_id));
  }

  @Get('shop-wise-products')
  shopProducts(@Query() q: any) {
    return this.productsService.shopWiseProductList(Number(q.shop_id));
  }
}
