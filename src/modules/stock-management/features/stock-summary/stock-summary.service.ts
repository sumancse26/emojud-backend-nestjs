import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class StockSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.warehouse_id) where.warehouse_id = toBigInt(query.warehouse_id);
    if (query.prod_id) where.prod_id = toBigInt(query.prod_id);
    if (query.status !== undefined) where.status = toNumber(query.status);

    const data = await this.prisma.stockMst.findMany({
      where,
      include: { shop: true, warehouse: true, stockDtls: true },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async detail(id: string) {
    const data = await this.prisma.stockMst.findUnique({
      where: { id: BigInt(id) },
      include: { shop: true, warehouse: true, stockDtls: true },
    });
    if (!data) throw new NotFoundException('Stock record not found');
    return { success: true, data };
  }
}
