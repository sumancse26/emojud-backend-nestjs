import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.company_id) where.company_id = toBigInt(query.company_id);
    if (query.status !== undefined) where.status = toNumber(query.status);
    if (query.role_name)
      where.role_name = { contains: String(query.role_name), mode: 'insensitive' };

    const data = await this.prisma.roles.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      short_code: data.short_code || `ROLE-${Date.now().toString(36).toUpperCase()}`,
      role_name: data.role_name,
      company_id: toBigInt(data.company_id),
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.roles.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return { success: true, message: 'Role updated successfully', data: updated };
    }

    const created = await this.prisma.roles.create({
      data: {
        ...payload,
        created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return { success: true, message: 'Role created successfully', data: created };
  }
}
