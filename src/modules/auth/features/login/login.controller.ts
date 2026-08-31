import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoginService } from './login.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import type {
  ChangePasswordInput,
  LoginInput,
} from './interfaces/login.interface';
import {
  changePasswordSchema,
  loginSchema,
} from './interfaces/login.interface';
import type { AccessTokenPayload } from 'src/modules/auth/jwt/jwt.service';
import { JwtService } from 'src/modules/auth/jwt/jwt.service';
import {
  REFRESH_TOKEN_COOKIE,
  REFRESH_COOKIE_OPTIONS,
  CLEAR_COOKIE_OPTIONS,
} from 'src/modules/auth/constants/cookie.config';

@Controller('api/auth')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() input: LoginInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceMeta = {
      ip: req.ip ?? (req.headers['x-forwarded-for'] as string) ?? null,
      mac: null,
    };

    const result = await this.loginService.login(input, deviceMeta);

    // Set refresh token as HTTP-only cookie
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      result.data.tokens.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );

    // Return access token in body (client stores in memory)
    return {
      success: result.success,
      message: result.message,
      accessToken: result.data.tokens.accessToken,
    };
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Read refresh token from cookie, fallback to body for non-browser clients
    const refreshToken =
      req.cookies?.[REFRESH_TOKEN_COOKIE] ?? req.body?.refreshToken;

    if (!refreshToken) {
      return {
        success: false,
        message: 'Refresh token not found',
      };
    }

    const result = await this.loginService.refreshTokens(refreshToken);

    // Set new refresh token cookie (token rotation)
    res.cookie(
      REFRESH_TOKEN_COOKIE,
      result.data.refreshToken,
      REFRESH_COOKIE_OPTIONS,
    );

    // Return new access token in body
    return {
      success: result.success,
      message: result.message,
      accessToken: result.data.accessToken,
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // Read refresh token from cookie, fallback to body
    const refreshToken =
      req.cookies?.[REFRESH_TOKEN_COOKIE] ?? req.body?.refreshToken;

    if (refreshToken) {
      await this.loginService.logout(refreshToken);
    }

    // Clear the refresh token cookie
    res.clearCookie(REFRESH_TOKEN_COOKIE, CLEAR_COOKIE_OPTIONS);

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: AccessTokenPayload) {
    return await this.loginService.getProfile(user.sub);
  }

  @Post('change-password')
  @UsePipes(new ZodValidationPipe(changePasswordSchema))
  async changePassword(
    @Req() req: Request,
    @Body() input: ChangePasswordInput,
  ) {
    const cookies = req.cookies?.[REFRESH_TOKEN_COOKIE];
    const isVerified = await this.jwtService.verifyRefreshToken(cookies);

    const res = await this.loginService.changePassword(input, isVerified.sub);

    return res;
  }

  @Get('nav-menu/:userId/:roleId')
  async navMenuList(
    @Param('userId') userId: string,
    @Param('roleId') roleId?: string,
  ) {
    return await this.loginService.getNavMenu(
      userId,
      roleId ? Number(roleId) : undefined,
    );
  }
}
