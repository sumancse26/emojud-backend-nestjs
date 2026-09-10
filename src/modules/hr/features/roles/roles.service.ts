import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId: number) {
    try {
      const data = await this.prisma.roles.findMany({
        where: {
          company_id: companyId,
          status: 1,
        },
        select: { id: true, short_code: true, role_name: true },
        orderBy: { id: 'desc' },
      });
      return { success: true, data };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async save(data: Record<string, any>, userInfo: Record<string, any>) {
    try {
      const id = toBigInt(data.id);
      const payload: any = {
        short_code:
          data.short_code || `ROLE-${Date.now().toString(36).toUpperCase()}`,
        role_name: data.role_name,
        company_id: toBigInt(userInfo.company_id),
        status: toNumber(data.status) ?? 1,
      };

      if (id) {
        const updated = await this.prisma.roles.update({
          where: { id },
          data: {
            ...payload,
            updated_at: new Date(),
            updated_by: toBigInt(userInfo.user_id),
          },
        });
        return {
          success: true,
          message: 'Role updated successfully',
          id: updated.id,
        };
      }

      const existed = await this.prisma.roles.findFirst({
        where: {
          role_name: {
            equals: data.role_name,
            mode: 'insensitive',
          },
        },
      });

      if (existed) {
        return {
          success: false,
          message: 'Already  existed',
        };
      }

      const created = await this.prisma.roles.create({
        data: {
          ...payload,
          created_by: toBigInt(userInfo.user_id),
        },
      });
      return {
        success: true,
        message: 'Role created successfully',
        id: created.id,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
