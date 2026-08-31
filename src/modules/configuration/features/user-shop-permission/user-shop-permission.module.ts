import { Module } from '@nestjs/common';
import { UserShopPermissionController } from './user-shop-permission.controller';
import { UserShopPermissionService } from './user-shop-permission.service';

@Module({
  controllers: [UserShopPermissionController],
  providers: [UserShopPermissionService],
  exports: [UserShopPermissionService],
})
export class UserShopPermissionModule {}
