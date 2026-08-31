import type { CookieOptions } from 'express';

/**
 * Cookie configuration for refresh tokens.
 *
 * - httpOnly: prevents client-side JS access (XSS protection)
 * - secure: only sent over HTTPS in production
 * - sameSite: 'strict' prevents CSRF
 * - path: only sent to auth routes (minimizes exposure)
 */

export const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const CLEAR_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
};
