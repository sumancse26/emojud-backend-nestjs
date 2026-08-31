import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/hr/interfaces/validation.interface';

@Controller('api')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Get('user-roles')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  userRoles(@Query() q: any) {
    return this.userRolesService.list(q);
  }

  @Post('user-roles')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveUserRole(@Body() b: any) {
    return this.userRolesService.save(b);
  }
}
