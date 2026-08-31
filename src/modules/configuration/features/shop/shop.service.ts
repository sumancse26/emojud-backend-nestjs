import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId?: number | string | bigint | null) {
    const company_id = toBigInt(companyId);

    if (company_id == null) {
      return { success: true, data: [] };
    }

    const data = await this.prisma.shop.findMany({
      where: {
        company_id,
      },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      company_id: toBigInt(data.company_id) ?? BigInt(1),
      display_code:
        data.display_code || `SHP-${randomUUID().slice(0, 6).toUpperCase()}`,
      short_code:
        data.short_code || `S-${randomUUID().slice(0, 4).toUpperCase()}`,
      shop_name: data.shop_name,
      address: data.address,
      address_2: data.address_2,
      phone: data.phone,
      image: toBigInt(data.image),
      slogan: data.slogan,
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.shop.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return {
        success: true,
        message: 'Shop updated successfully',
        data: updated,
      };
    }

    const created = await this.prisma.shop.create({
      data: {
        ...payload,
        created_by:
          toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return {
      success: true,
      message: 'Shop created successfully',
      data: created,
    };
  }
}
