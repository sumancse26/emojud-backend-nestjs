import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';

export interface AccessTokenPayload extends JWTPayload {
  sub: string;
  username: string;
  roleId: number | null;
  type: 'access';
}

export interface RefreshTokenPayload extends JWTPayload {
  sub: string;
  sessionId: string;
  type: 'refresh';
}

@Injectable()
export class JwtService {
  private readonly accessSecret: Uint8Array;
  private readonly refreshSecret: Uint8Array;

  constructor(private readonly configService: ConfigService) {
    const accessSecret = configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    const refreshSecret =
      configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    this.accessSecret = new TextEncoder().encode(accessSecret);
    this.refreshSecret = new TextEncoder().encode(refreshSecret);
  }

  async generateAccessToken(user: {
    id: number;
    username: string;
    roleId?: number;
  }): Promise<string> {
    return new SignJWT({
      username: user.username,
      roleId: user.roleId ?? null,
      type: 'access',
    })
      .setProtectedHeader({
        alg: 'HS256',
        typ: 'JWT',
      })
      .setSubject(user.id?.toString())
      .setIssuedAt()
      .setExpirationTime(
        this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'),
      )
      .sign(this.accessSecret);
  }

  async generateRefreshToken(
    userId: number,
    sessionId: string,
  ): Promise<string> {
    return new SignJWT({ sessionId, type: 'refresh' })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setSubject(userId.toString())
      .setIssuedAt()
      .setExpirationTime(
        this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN'),
      )
      .sign(this.refreshSecret);
  }
  async verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    try {
      const { payload } = await jwtVerify(token, this.accessSecret, {
        algorithms: ['HS256'],
      });
      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid access token');
      }
      return payload as AccessTokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const { payload } = await jwtVerify(token, this.refreshSecret, {
        algorithms: ['HS256'],
      });
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return payload as RefreshTokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
