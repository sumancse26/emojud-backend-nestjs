import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class DesignationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId: number) {
    try {
      const data = await this.prisma.designations.findMany({
        where: {
          company_id: companyId,
          status: 1,
        },
        select: {
          id: true,
          display_code: true,
          designation_name: true,
        },
        orderBy: { id: 'desc' },
      });
      return { data };
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
        display_code:
          data.display_code || `DSG-${randomUUID().slice(0, 6).toUpperCase()}`,
        designation_name: data.designation_name,
        company_id: toBigInt(userInfo?.companyId),
        status: toNumber(data.status) ?? 1,
      };

      if (id) {
        const updated = await this.prisma.designations.update({
          where: { id },
          data: {
            ...payload,
            updated_at: new Date(),
            updated_by: toBigInt(userInfo?.userId),
          },
        });
        return {
          message: 'Designation updated successfully',
          data: { id: updated.id },
        };
      }

      const existed = await this.prisma.designations.findFirst({
        where: {
          designation_name: {
            equals: data.designation_name?.trim(),
            mode: 'insensitive',
          },
        },
      });

      if (existed) {
        return {
          success: false,
          message: 'Already exist',
        };
      }

      const created = await this.prisma.designations.create({
        data: {
          ...payload,
          created_by: toBigInt(userInfo?.userId),
        },
      });
      return {
        message: 'Designation created successfully',
        data: { id: created.id },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
