import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt } from 'src/common/utils/prisma.util';

@Injectable()
export class UserShopPermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.user_id) where.user_id = toBigInt(query.user_id);
    if (query.company_id) where.company_id = toBigInt(query.company_id);

    const data = await this.prisma.userShopPermission.findMany({
      select: {
        id: true,
        user_id: true,
        company_id: true,
        shop: {
          select: {
            id: true,
            shop_name: true,
            display_code: true,
            short_code: true,
          },
        },
        user: {
          select: {
            id: true,
            employee_id: true,
            username: true,
            employee: {
              select: {
                id: true,
                employee_code: true,
                full_name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },

      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async saveBatch(
    items: Record<string, any>[],
    loginUserId: number | string | bigint,
  ) {
    const results: any[] = [];
    const updatedIds: bigint[] = [];
    let createdCount = 0;
    let updatedCount = 0;
    const login_user_id = toBigInt(loginUserId);

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
              updated_by: login_user_id,
            },
          });
          results.push(updated);
          updatedIds.push(id);
          updatedCount++;
        } else {
          const created = await tx.userShopPermission.create({
            data: {
              ...payload,
              created_by: login_user_id,
            },
          });
          results.push(created);
          createdCount++;
        }
      }
    });

    const message =
      createdCount > 0 && updatedCount > 0
        ? 'Permissions saved and updated successfully'
        : updatedCount > 0
          ? 'Permissions updated successfully'
          : 'Permissions saved successfully';

    return {
      success: true,
      message,
    };
  }
}
