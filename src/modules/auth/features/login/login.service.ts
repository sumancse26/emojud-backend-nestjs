import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from 'src/modules/auth/jwt/jwt.service';
import { PasswordServiceService } from 'src/modules/auth/password-service/password-service.service';
import type {
  ChangePasswordInput,
  LoginInput,
} from './interfaces/login.interface';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordServiceService,
  ) {}

  /**
   * Authenticate user with username/password.
   * Creates a session and returns access + refresh tokens.
   */
  async login(
    input: LoginInput,
    deviceMeta?: { ip?: string | null; mac?: string | null },
  ) {
    // 1. Find user by username
    const user = await this.prisma.users.findUnique({
      where: { username: input.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // 2. Check user status
    if (user.status !== 1) {
      throw new UnauthorizedException('User account is inactive');
    }

    // 3. Verify password
    const isPasswordValid = await this.passwordService.verify(
      input.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // 4. Create session
    const sessionId = randomUUID();
    const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.admUserSession.create({
      data: {
        session_id: sessionId,
        user_id: user.id,
        device_ip: deviceMeta?.ip ?? null,
        device_mac: deviceMeta?.mac ?? null,
        valid_until: validUntil,
        is_active: 'Y',
        status: 1,
        created_by: user.id,
      },
    });

    // 5. Update last_login timestamp
    await this.prisma.users.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    // 6. Generate tokens
    const accessToken = await this.jwtService.generateAccessToken({
      user_id: Number(user.id),
      username: user.username,
      company_id: user.company_id ? Number(user.company_id) : null,
      role_id: user.default_role_id ? Number(user.default_role_id) : null,
    });

    const refreshToken = await this.jwtService.generateRefreshToken(
      Number(user.id),
      sessionId,
      user.company_id ? Number(user.company_id) : null,
      user.default_role_id ? Number(user.default_role_id) : null,
    );

    // 7. Build response (exclude password_hash)
    const { password_hash: _, ...userWithoutPassword } = user;


    return {
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        tokens: { accessToken, refreshToken },
      },
    };
  }

  /**
   * Issue new access + refresh tokens using a valid refresh token.
   * Implements token rotation: old session is deactivated, new one is created.
   */
  async refreshTokens(refreshToken: string) {
    // 1. Verify the refresh token signature and claims
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);

    const userId = BigInt(payload.user_id);
    const sessionId = payload.sessionId;

    // 2. Validate the session exists and is active
    const session = await this.prisma.admUserSession.findFirst({
      where: {
        session_id: sessionId,
        user_id: userId,
        is_active: 'Y',
      },
    });

    if (!session) {
      throw new UnauthorizedException(
        'Session not found or already invalidated',
      );
    }

    // 3. Check session expiry
    if (session.valid_until && session.valid_until < new Date()) {
      // Mark expired session as inactive
      await this.prisma.admUserSession.update({
        where: { id: session.id },
        data: { is_active: 'N', logout_date: new Date() },
      });
      throw new UnauthorizedException(
        'Session has expired. Please login again',
      );
    }

    // 4. Fetch user for token payload
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        default_role_id: true,
        company_id: true,
        status: true,
      },
    });

    if (!user || user.status !== 1) {
      throw new UnauthorizedException('User account is inactive or not found');
    }

    // 5. Token rotation — deactivate old session, create new one
    const newSessionId = randomUUID();
    const newValidUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.$transaction([
      this.prisma.admUserSession.update({
        where: { id: session.id },
        data: { is_active: 'N' },
      }),
      this.prisma.admUserSession.create({
        data: {
          session_id: newSessionId,
          user_id: userId,
          device_ip: session.device_ip,
          device_mac: session.device_mac,
          valid_until: newValidUntil,
          is_active: 'Y',
          status: 1,
          created_by: userId,
        },
      }),
    ]);

    // 6. Generate new token pair
    const newAccessToken = await this.jwtService.generateAccessToken({
      user_id: Number(user.id),
      username: user.username,
      company_id: user.company_id ? Number(user.company_id) : null,
      role_id: user.default_role_id ? Number(user.default_role_id) : null,
    });

    const newRefreshToken = await this.jwtService.generateRefreshToken(
      Number(user.id),
      newSessionId,
      user.company_id ? Number(user.company_id) : null,
      user.default_role_id ? Number(user.default_role_id) : null,
    );

    return {
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  /**
   * Invalidate the session associated with the refresh token.
   */
  async logout(refreshToken: string) {
    // 1. Verify the refresh token
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);

    const userId = BigInt(payload.user_id);
    const sessionId = payload.sessionId;

    // 2. Find and deactivate the session
    const session = await this.prisma.admUserSession.findFirst({
      where: {
        session_id: sessionId,
        user_id: userId,
        is_active: 'Y',
      },
    });

    if (session) {
      await this.prisma.admUserSession.update({
        where: { id: session.id },
        data: {
          is_active: 'N',
          logout_date: new Date(),
        },
      });
    }

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  /**
   * Fetch the authenticated user's profile.
   */
  async getProfile(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        username: true,
        default_role_id: true,
        company_id: true,
        last_login: true,
        status: true,
        employee: {
          select: {
            id: true,
            employee_code: true,
            full_name: true,
            phone: true,
            email: true,
            photo_url: true,
            department: {
              select: { id: true, department_name: true },
            },
            designation: {
              select: { id: true, designation_name: true },
            },
          },
        },
        userRoles: {
          include: {
            role: { select: { id: true, role_name: true, short_code: true } },
          },
        },
        userShopPermissions: {
          include: {
            shop: {
              select: { id: true, shop_name: true, display_code: true },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      data: user,
    };
  }

  /**
   * Return the navigation menu available to the authenticated user.
   *
   * This is the ORM equivalent of public.fd_get_nav_menu(company_id, role_id).
   */
  async getNavMenu(userId: string, tokenRoleId?: number | null) {
    const success = (data: unknown[] = []) => ({
      response_code: 200,
      message: 'success',
      data,
    });

    try {
      const user = await this.prisma.users.findUnique({
        where: { id: BigInt(userId) },
        select: { company_id: true, default_role_id: true },
      });

      const companyId = user?.company_id;
      const roleId =
        tokenRoleId == null ? user?.default_role_id : BigInt(tokenRoleId);

      if (companyId == null || roleId == null) return success();

      const permissions = await this.prisma.roleWiseNavPermission.findMany({
        where: {
          company_id: companyId,
          role_id: roleId,
          is_active: 1,
        },
        select: { feature_id: true },
      });

      const featureIds = [
        ...new Set(permissions.map(({ feature_id }) => feature_id)),
      ];

      if (featureIds.length === 0) return success();

      const features = await this.prisma.features.findMany({
        where: { id: { in: featureIds } },
        select: {
          id: true,
          feature_name: true,
          module_name: true,
          route_url: true,
          parent: true,
          feature_icon: true,
        },
        orderBy: { id: 'asc' },
      });

      const childrenByParent = features.reduce((groups, feature) => {
        if (feature.parent !== null) {
          const key = feature.parent.toString();
          groups.set(key, [...(groups.get(key) ?? []), feature]);
        }
        return groups;
      }, new Map<string, (typeof features)[number][]>());

      const toMenuItem = (feature: (typeof features)[number]) => ({
        id: feature.id,
        feature_name: feature.feature_name,
        module_name: feature.module_name,
        route_url: feature.route_url,
        parent: feature.parent,
        feature_icon: feature.feature_icon,
      });

      const data = features
        .filter((feature) => feature.parent === null)
        .map((feature) => ({
          ...toMenuItem(feature),
          children: (childrenByParent.get(feature.id.toString()) ?? []).map(
            toMenuItem,
          ),
        }));

      return success(data);
    } catch (error) {
      return {
        response_code: 400,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async changePassword(input: ChangePasswordInput, id: string) {
    const userId = BigInt(id);

    const userInfo = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { password_hash: true },
    });

    if (!userInfo) {
      throw new UnauthorizedException('User not found');
    }

    const isOldPasswordValid = await this.passwordService.verify(
      input.old_password,
      userInfo.password_hash,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Password not matched');
    }

    const newPasswordHash = await this.passwordService.hash(input.new_password);

    const user = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        password_hash: newPasswordHash,
        updated_at: new Date(),
        updated_by: userId,
      },
      select: {
        id: true,
        username: true,
        status: true,
        updated_at: true,
        updated_by: true,
      },
    });

    return {
      success: true,
      message: 'Password changed successfully',
      data: user,
    };
  }
}
