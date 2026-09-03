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

    return { success: true, data: shop };
  }
}
