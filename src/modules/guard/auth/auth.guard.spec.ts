import { Reflector } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtService } from '../../auth/jwt/jwt.service';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const jwtServiceMock = {} as unknown as JwtService;
    const reflectorMock = {} as unknown as Reflector;
    const guard = new AuthGuard(jwtServiceMock, reflectorMock);
    expect(guard).toBeDefined();
  });
});
