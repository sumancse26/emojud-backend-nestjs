import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.status !== undefined) where.status = toNumber(query.status);
    if (query.customer_name)
      where.customer_name = { contains: String(query.customer_name), mode: 'insensitive' };
    if (query.phone)
      where.phone = { contains: String(query.phone) };

    const data = await this.prisma.customers.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      shop_id: toBigInt(data.shop_id),
      customer_code: data.customer_code || `CUS-${Date.now().toString(36).toUpperCase()}`,
      customer_name: data.customer_name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      previous_due: data.previous_due ? Number(data.previous_due) : 0,
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.customers.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return { success: true, message: 'Customer updated successfully', data: updated };
    }

    const created = await this.prisma.customers.create({
      data: {
        ...payload,
        created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return { success: true, message: 'Customer created successfully', data: created };
  }
}
