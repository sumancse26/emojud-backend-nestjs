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
      return { data: [] };
    }

    const data = await this.prisma.shop.findMany({
      where: {
        company_id,
      },
      orderBy: { id: 'desc' },
      omit: {
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
      },
    });
    return { data };
  }

  async userShopList(companyId: number, userId: number) {
    const company_id = toBigInt(companyId);
    const user_id = toBigInt(userId);

    const user = await this.prisma.userShopPermission.findMany({
      where: {
        user_id: user_id,
        company_id: company_id,
      },
    });

    const shop = await this.prisma.shop.findMany({
      where: {
        id: { in: user.map((item) => item.shop_id) },
      },
      orderBy: { id: 'desc' },
      omit: {
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
      },
    });

    return { data: shop };
  }

  async save(data: Record<string, any>, loginUserId?: number) {
    try {
      const id = toBigInt(data.id);
      const company_id = toBigInt(data.company_id);
      const created_by = toBigInt(data.created_by ?? data.login_user_id ?? loginUserId);
      const updated_by = toBigInt(data.updated_by ?? data.login_user_id ?? loginUserId);
      const image = toBigInt(data.image);

      const payload = {
        company_id: company_id ?? BigInt(1),
        display_code: data.display_code ?? '',
        short_code: data.short_code ?? '',
        shop_name: data.shop_name,
        address: data.address ?? null,
        address_2: data.address_2 ?? null,
        phone: data.phone ?? null,
        image: image ?? null,
        slogan: data.slogan ?? null,
        status: toNumber(data.status) ?? 1,
      };

      if (id && id !== BigInt(0)) {
        const updated = await this.prisma.shop.update({
          where: { id },
          data: {
            ...payload,
            updated_at: new Date(),
            updated_by: updated_by ?? null,
          },
        });

        return {
          response_code: 200,
          message: 'Shop updated successfully',
          shop_name: updated.shop_name,
          id: updated.id,
        };
      }

      const created = await this.prisma.shop.create({
        data: {
          ...payload,
          created_at: new Date(),
          created_by: created_by ?? null,
        },
      });

      return {
        response_code: 200,
        message: 'Shop created successfully',
        id: created.id,
        shop_name: created.shop_name,
      };
    } catch (err: any) {
      return {
        response_code: 400,
        message: err.message,
      };
    }
  }
}
