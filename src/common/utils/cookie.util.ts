import type { Request } from 'express';
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
