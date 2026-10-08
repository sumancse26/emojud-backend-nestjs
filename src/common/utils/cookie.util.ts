import type { Request } from 'express';
import { decodeJwt, type JWTPayload } from 'jose';
import { REFRESH_TOKEN_COOKIE } from 'src/modules/auth/constants/cookie.config';

/**
 * Retrieves a cookie from an incoming request.
 *
 * Returns undefined when the cookie is missing or is not a string value.
 */
export function getCookie(req: Request): string | undefined {
  const value = req.cookies?.[REFRESH_TOKEN_COOKIE];

  return typeof value === 'string' ? value : undefined;
}

/**
 * Decodes the refresh-token cookie and returns its JWT payload.
 *
 * This only decodes the token; it does not verify its signature or expiry.
 * Use JwtService.verifyRefreshToken() before trusting the returned data.
 */
export function decodeCookie<T extends JWTPayload = JWTPayload>(
  req: Request,
): T | undefined {
  // 1. If req.user is already populated by AuthGuard from the Bearer token, return it
  if ((req as any)?.user) {
    return (req as any).user as T;
  }

  // 2. Fallback to extracting and decoding the refresh token cookie
  const token = getCookie(req);

  if (!token) {
    return undefined;
  }

  try {
    return decodeJwt(token) as T;
  } catch {
    return undefined;
  }
}

