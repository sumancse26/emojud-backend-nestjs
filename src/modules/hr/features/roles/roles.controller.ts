import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('api')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('role')
  roles(@Query() q: any) {
    return this.rolesService.list(q);
  }

  @Post('role')
  saveRole(@Body() b: any) {
    return this.rolesService.save(b);
  }
}
