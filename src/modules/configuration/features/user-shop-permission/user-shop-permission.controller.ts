import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserShopPermissionService } from './user-shop-permission.service';

@Controller('api')
export class UserShopPermissionController {
  constructor(
    private readonly permissionService: UserShopPermissionService,
  ) {}

  @Get('user-wise-shop')
  userShops(@Query() q: any) {
    return this.permissionService.list(q);
  }

  @Get('user-wise-permission')
  permissions(@Query() q: any) {
    return this.permissionService.list(q);
  }

  @Post('user-wise-permission')
  savePermissions(@Body() b: any) {
    return this.permissionService.saveBatch(b.data ?? []);
  }
}
