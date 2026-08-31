import { Global, Module } from '@nestjs/common';
import { LoginModule } from './features/login/login.module';
import { JwtService } from './jwt/jwt.service';
import { PasswordServiceService } from './password-service/password-service.service';
import { AuthGuard } from '../guard/auth/auth.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule, LoginModule],
  providers: [JwtService, PasswordServiceService, AuthGuard],
  exports: [LoginModule, JwtService, PasswordServiceService, AuthGuard],
})
export class AuthModule {}
