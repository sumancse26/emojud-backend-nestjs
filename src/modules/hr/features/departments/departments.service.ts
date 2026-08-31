import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.company_id) where.company_id = toBigInt(query.company_id);
    if (query.status !== undefined) where.status = toNumber(query.status);
    if (query.department_name)
      where.department_name = { contains: String(query.department_name), mode: 'insensitive' };

    const data = await this.prisma.departments.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      display_code: data.display_code || `DEP-${randomUUID().slice(0, 6).toUpperCase()}`,
      department_name: data.department_name,
      company_id: toBigInt(data.company_id),
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.departments.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return { success: true, message: 'Department updated successfully', data: updated };
    }

    const created = await this.prisma.departments.create({
      data: {
        ...payload,
        created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return { success: true, message: 'Department created successfully', data: created };
  }
}
