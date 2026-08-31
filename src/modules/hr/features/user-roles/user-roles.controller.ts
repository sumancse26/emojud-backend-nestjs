import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';

@Controller('api')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Get('user-roles')
  userRoles(@Query() q: any) {
    return this.userRolesService.list(q);
  }

  @Post('user-roles')
  saveUserRole(@Body() b: any) {
    return this.userRolesService.save(b);
  }
}
