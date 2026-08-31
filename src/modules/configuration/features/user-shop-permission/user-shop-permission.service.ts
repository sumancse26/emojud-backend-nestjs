import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt } from 'src/common/utils/prisma.util';

@Injectable()
export class UserShopPermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.user_id) where.user_id = toBigInt(query.user_id);
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.company_id) where.company_id = toBigInt(query.company_id);

    const data = await this.prisma.userShopPermission.findMany({
      where,
      include: { shop: true, user: true },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async saveBatch(items: Record<string, any>[]) {
    const results: any[] = [];

    await this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        const id = toBigInt(item.id);
        const payload: any = {
          user_id: toBigInt(item.user_id) ?? BigInt(1),
          shop_id: toBigInt(item.shop_id) ?? BigInt(1),
          company_id: toBigInt(item.company_id),
        };

        if (id) {
          const updated = await tx.userShopPermission.update({
            where: { id },
            data: {
              ...payload,
              updated_at: new Date(),
              updated_by: toBigInt(item.updated_by ?? item.login_user_id),
            },
          });
          results.push(updated);
        } else {
          const created = await tx.userShopPermission.create({
            data: {
              ...payload,
              created_by: toBigInt(item.created_by ?? item.login_user_id) ?? BigInt(1),
            },
          });
          results.push(created);
        }
      }
    });

    return { success: true, message: 'Permissions saved successfully', data: results };
  }
}
