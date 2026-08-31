import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.company_id) where.company_id = toBigInt(query.company_id);
    if (query.status !== undefined) where.status = toNumber(query.status);
    if (query.warehouse_name)
      where.warehouse_name = { contains: String(query.warehouse_name), mode: 'insensitive' };

    const data = await this.prisma.warehouse.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      shop_id: toBigInt(data.shop_id),
      warehouse_name: data.warehouse_name,
      address: data.address,
      company_id: toBigInt(data.company_id),
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.warehouse.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return { success: true, message: 'Warehouse updated successfully', data: updated };
    }

    const created = await this.prisma.warehouse.create({
      data: {
        ...payload,
        created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return { success: true, message: 'Warehouse created successfully', data: created };
  }
}
