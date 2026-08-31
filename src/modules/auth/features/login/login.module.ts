import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from 'src/modules/auth/jwt/jwt.service';
import { PasswordServiceService } from 'src/modules/auth/password-service/password-service.service';

@Module({
  imports: [PrismaModule],
  controllers: [LoginController],
  providers: [LoginService, JwtService, PasswordServiceService],
  exports: [LoginService, JwtService, PasswordServiceService],
})
export class LoginModule {}
