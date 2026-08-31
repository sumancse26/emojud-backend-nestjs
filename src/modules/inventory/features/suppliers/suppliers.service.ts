import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.status !== undefined) where.status = toNumber(query.status);
    if (query.supplier_name)
      where.supplier_name = { contains: String(query.supplier_name), mode: 'insensitive' };
    if (query.phone)
      where.phone = { contains: String(query.phone) };

    const data = await this.prisma.suppliers.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      shop_id: toBigInt(data.shop_id),
      supplier_code: data.supplier_code || `SUP-${Date.now().toString(36).toUpperCase()}`,
      supplier_name: data.supplier_name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      previous_due: data.previous_due ? Number(data.previous_due) : 0,
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.suppliers.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return { success: true, message: 'Supplier updated successfully', data: updated };
    }

    const created = await this.prisma.suppliers.create({
      data: {
        ...payload,
        created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return { success: true, message: 'Supplier created successfully', data: created };
  }
}
