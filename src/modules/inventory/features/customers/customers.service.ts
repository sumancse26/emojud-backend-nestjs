import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    try {
      const data = await this.prisma.customers.findMany({
        where: {
          shop_id: query.shop_id,
        },
        select: {
          id: true,
          customer_code: true,
          customer_name: true,
          phone: true,
          email: true,
          address: true,
          previous_due: true,
          shop: {
            select: {
              id: true,
              display_code: true,
              short_code: true,
              shop_name: true,
            },
          },
        },

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

  async customerByPhone(phone: string) {
    try {
      if (!phone) {
        return {
          success: false,
          message: 'Phone no required',
        };
      }

      const custList = await this.prisma.customers.findMany({
        where: {
          phone: {
            equals: phone,
            mode: 'insensitive',
          },
        },
        omit: {
          status: true,
          created_at: true,
          created_by: true,
          updated_at: true,
          updated_by: true,
        },
      });

      return {
        success: true,
        data: custList,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async save(data: Record<string, any>, userId: number) {
    const id = toBigInt(data.id);
    const payload: any = {
      shop_id: toBigInt(data.shop_id),
      customer_code:
        data.customer_code || `CUS-${Date.now().toString(36).toUpperCase()}`,
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
          updated_by: toBigInt(userId),
        },
      });
      return {
        success: true,
        message: 'Customer updated successfully',
        data: updated,
      };
    }

    const created = await this.prisma.customers.create({
      data: {
        ...payload,
        created_by: toBigInt(userId),
      },
    });
    return {
      success: true,
      message: 'Customer created successfully',
      data: created,
    };
  }
}
