import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId: number) {
    const data = await this.prisma.departments.findMany({
      where: {
        company_id: companyId,
        status: 1,
      },
      omit: {
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
        status: true,
      },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>, companyId: number, userId: number) {
    const id = toBigInt(data.id);
    const payload: any = {
      display_code:
        data.display_code || `DEP-${randomUUID().slice(0, 6).toUpperCase()}`,
      department_name: data.department_name,
      company_id: toBigInt(companyId),
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.departments.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(userId),
        },
      });
      return {
        success: true,
        message: 'Department updated successfully',
        id: updated.id,
      };
    }

    const created = await this.prisma.departments.create({
      data: {
        ...payload,
        created_by: toBigInt(userId),
      },
    });
    return {
      success: true,
      message: 'Department created successfully',
      id: created.id,
    };
  }
}
