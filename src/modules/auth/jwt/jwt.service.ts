import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';

export interface AccessTokenPayload extends JWTPayload {
  sub: string;
  user_id: number;
  company_id: number | null;
  role_id: number | null;
  username: string;
  type: 'access';
}

export interface RefreshTokenPayload extends JWTPayload {
  sub: string;
  user_id: number;
  company_id: number | null;
  role_id: number | null;
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
    user_id: number;
    username: string;
    company_id?: number | null;
    role_id?: number | null;
  }): Promise<string> {
    return new SignJWT({
      user_id: user.user_id,
      company_id: user.company_id ?? null,
      role_id: user.role_id ?? null,
      username: user.username,
      type: 'access',
    })
      .setProtectedHeader({
        alg: 'HS256',
        typ: 'JWT',
      })
      .setSubject(user.user_id.toString())
      .setIssuedAt()
      .setExpirationTime(
        this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN'),
      )
      .sign(this.accessSecret);
  }

  async generateRefreshToken(
    userId: number,
    sessionId: string,
    companyId?: number | null,
    roleId?: number | null,
  ): Promise<string> {
    return new SignJWT({
      user_id: userId,
      company_id: companyId ?? null,
      role_id: roleId ?? null,
      sessionId,
      type: 'refresh',
    })
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
      if (
        payload.type !== 'access' ||
        typeof payload.user_id !== 'number' ||
        !Number.isSafeInteger(payload.user_id) ||
        (payload.company_id !== null &&
          (typeof payload.company_id !== 'number' ||
            !Number.isSafeInteger(payload.company_id))) ||
        (payload.role_id !== null &&
          (typeof payload.role_id !== 'number' ||
            !Number.isSafeInteger(payload.role_id)))
      ) {
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
      if (
        payload.type !== 'refresh' ||
        typeof payload.user_id !== 'number' ||
        !Number.isSafeInteger(payload.user_id) ||
        (payload.company_id !== null &&
          (typeof payload.company_id !== 'number' ||
            !Number.isSafeInteger(payload.company_id))) ||
        (payload.role_id !== null &&
          (typeof payload.role_id !== 'number' ||
            !Number.isSafeInteger(payload.role_id))) ||
        typeof payload.sessionId !== 'string'
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return payload as RefreshTokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
