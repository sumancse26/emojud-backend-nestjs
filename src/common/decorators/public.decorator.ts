import { SetMetadata } from '@nestjs/common';

/**
 * Mark a route as publicly accessible, bypassing the AuthGuard.
 *
 * Usage: @Public() on a controller method
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
