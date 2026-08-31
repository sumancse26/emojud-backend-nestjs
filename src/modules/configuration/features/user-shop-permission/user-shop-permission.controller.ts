import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { UserShopPermissionService } from './user-shop-permission.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/configuration/interfaces/validation.interface';

@Controller('api')
export class UserShopPermissionController {
  constructor(
    private readonly permissionService: UserShopPermissionService,
  ) {}

  @Get('user-wise-shop')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  userShops(@Query() q: any) {
    return this.permissionService.list(q);
  }

  @Get('user-wise-permission')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  permissions(@Query() q: any) {
    return this.permissionService.list(q);
  }

  @Post('user-wise-permission')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  savePermissions(@Body() b: any) {
    return this.permissionService.saveBatch(b.data ?? []);
  }
}
