import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt } from 'src/common/utils/prisma.util';

@Injectable()
export class UserRolesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.user_id) where.user_id = toBigInt(query.user_id);
    if (query.role_id) where.role_id = toBigInt(query.role_id);

    const data = await this.prisma.userRoles.findMany({
      where,
      include: { role: true, user: true },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      user_id: toBigInt(data.user_id) ?? BigInt(1),
      role_id: toBigInt(data.role_id) ?? BigInt(1),
    };

    if (id) {
      const updated = await this.prisma.userRoles.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return { success: true, message: 'User role updated successfully', data: updated };
    }

    const created = await this.prisma.userRoles.create({
      data: {
        ...payload,
        created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return { success: true, message: 'User role created successfully', data: created };
  }
}
