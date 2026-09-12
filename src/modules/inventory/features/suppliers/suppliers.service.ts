import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(shopId: number) {
    try {
      const data = await this.prisma.suppliers.findMany({
        where: { shop_id: shopId, status: 1 },
        omit: {
          status: true,
          created_at: true,
          created_by: true,
          updated_at: true,
          updated_by: true,
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

  async supplierByPhone(phone: string) {
    try {
      const data = await this.prisma.suppliers.findMany({
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

  async save(data: Record<string, any>, userId: number) {
    try {
      const id = toBigInt(data.id);
      const payload: any = {
        shop_id: toBigInt(data.shop_id),
        supplier_code:
          data.supplier_code || `SUP-${Date.now().toString(36).toUpperCase()}`,
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
            updated_by: toBigInt(userId),
          },
        });
        return {
          message: 'Supplier updated successfully',
          data: { id: updated.id },
        };
      }
      const existed = await this.prisma.suppliers.findFirst({
        where: { phone: data.phone },
      });
      if (existed) {
        return {
          success: false.valueOf,
          message: 'Supplier already exist.',
        };
      }

      const created = await this.prisma.suppliers.create({
        data: {
          ...payload,
          created_by: toBigInt(userId),
        },
      });

      return {
        message: 'Supplier created successfully',
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
