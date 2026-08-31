import { Module } from '@nestjs/common';
import { ShopModule } from './features/shop/shop.module';
import { WarehouseModule } from './features/warehouse/warehouse.module';
import { ProductCategoryModule } from './features/product-category/product-category.module';
import { UserShopPermissionModule } from './features/user-shop-permission/user-shop-permission.module';

@Module({
  imports: [
    ShopModule,
    WarehouseModule,
    ProductCategoryModule,
    UserShopPermissionModule,
  ],
  exports: [
    ShopModule,
    WarehouseModule,
    ProductCategoryModule,
    UserShopPermissionModule,
  ],
})
export class ConfigurationModule {}
