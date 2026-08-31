import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AccessTokenPayload } from '../../modules/auth/jwt/jwt.service';

/**
 * Extracts the authenticated user payload from the request object.
 * The payload is set by AuthGuard after verifying the access token.
 *
 * Usage: @CurrentUser() user: AccessTokenPayload
 * Usage: @CurrentUser('user_id') userId: number
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AccessTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request['user'] as AccessTokenPayload;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
