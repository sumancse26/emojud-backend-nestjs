import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';
import { type SaveWarehouseInput } from 'src/modules/configuration/interfaces/validation.interface';

@Injectable()
export class WarehouseService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId: number) {
    const data = await this.prisma.warehouse.findMany({
      where: {
        company_id: toBigInt(companyId),
      },
      select: {
        id: true,
        shop_id: true,
        warehouse_name: true,
        shop: {
          select: {
            id: true,
            display_code: true,
            short_code: true,
            shop_name: true,
            address: true,
            address_2: true,
            phone: true,
            image: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: SaveWarehouseInput, loginUserId: number) {
    const id = toBigInt(data.id);
    const payload: any = {
      shop_id: toBigInt(data.shop_id),
      warehouse_name: data.warehouse_name,
      address: data.address,
      company_id: toBigInt(data.company_id),
    };

    if (payload.shop_id == null) {
      throw new BadRequestException('A valid shop_id is required');
    }

    const shop = await this.prisma.shop.findFirst({
      where: {
        id: payload.shop_id,
        ...(payload.company_id != null
          ? { company_id: payload.company_id }
          : {}),
      },
      select: { id: true },
    });

    if (!shop) {
      throw new BadRequestException(
        'The selected shop does not exist or does not belong to the company',
      );
    }

    if (id) {
      const updated = await this.prisma.warehouse.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(loginUserId),
        },
      });
      return {
        success: true,
        message: 'Warehouse updated successfully',
        id: updated.id,
      };
    }

    const created = await this.prisma.warehouse.create({
      data: {
        ...payload,
        created_by: toBigInt(loginUserId) ?? BigInt(1),
      },
    });
    return {
      success: true,
      message: 'Warehouse created successfully',
      id: created.id,
    };
  }
}
