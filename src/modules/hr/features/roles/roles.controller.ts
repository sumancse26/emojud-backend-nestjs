import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { listQuerySchema, saveBodySchema } from 'src/modules/hr/interfaces/validation.interface';

@Controller('api')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('role')
  @UsePipes(new ZodValidationPipe(listQuerySchema))
  roles(@Query() q: any) {
    return this.rolesService.list(q);
  }

  @Post('role')
  @UsePipes(new ZodValidationPipe(saveBodySchema))
  saveRole(@Body() b: any) {
    return this.rolesService.save(b);
  }
}
