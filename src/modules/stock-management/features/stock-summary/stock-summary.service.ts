import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { stockDetailsType } from './dto/stock-summary.dto';

@Injectable()
export class StockSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(shopId: number) {
    const data = await this.prisma.products.findMany({
      where: { shop_id: shopId },
      select: {
        id: true,
        product_code: true,
        product_name: true,
        category: {
          select: {
            id: true,
            parent_category_id: true,
            category_name: true,
          },
        },
        prod_stock: {
          select: {
            id: true,
            stock_date: true,
            current_stock: true,
          },
        },
        brand: {
          select: {
            id: true,
            lookup_code: true,
            lookup_value: true,
          },
        },
        units: {
          select: {
            id: true,
            lookup_code: true,
            lookup_value: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
    return { data };
  }

  async detail(q: stockDetailsType) {
    const shopId = BigInt(q.shop_id);
    const productId = BigInt(q.prod_id);

    try {
      const stockDetails = await this.prisma.stockDtl.findMany({
        where: {
          prod_id: productId,
          shop_id: shopId,
          qty: { gt: 0 },
        },
        select: {
          id: true,
          lot_id: true,
          qty: true,
        },
        orderBy: { id: 'asc' },
      });

      const lotIds = stockDetails.flatMap((detail) =>
        detail.lot_id === null ? [] : [detail.lot_id],
      );
      const lots = lotIds.length
        ? await this.prisma.productLot.findMany({
            where: { id: { in: lotIds } },
            select: { id: true, lot_no: true },
          })
        : [];
      const lotById = new Map(lots.map((lot) => [lot.id, lot]));

      const transactions = lotIds.length
        ? await this.prisma.stockTransaction.findMany({
            where: {
              shop_id: shopId,
              lot_id: { in: lotIds },
              ref_type: BigInt(1),
            },
            select: {
              lot_id: true,
              ref_id: true,
              ref_no: true,
            },
          })
        : [];
      const transactionsByLot = new Map<bigint, typeof transactions>();

      for (const transaction of transactions) {
        if (transaction.lot_id === null) continue;

        const lotTransactions = transactionsByLot.get(transaction.lot_id) ?? [];
        lotTransactions.push(transaction);
        transactionsByLot.set(transaction.lot_id, lotTransactions);
      }

      const purchaseIds = transactions.flatMap((transaction) =>
        transaction.ref_id === null ? [] : [transaction.ref_id],
      );
      const purchases = purchaseIds.length
        ? await this.prisma.purchaseMst.findMany({
            where: {
              id: { in: purchaseIds },
              shop_id: shopId,
            },
            select: {
              id: true,
              supplier_id: true,
            },
          })
        : [];
      const purchaseById = new Map(
        purchases.map((purchase) => [purchase.id, purchase]),
      );

      const supplierIds = purchases.map((purchase) => purchase.supplier_id);
      const suppliers = supplierIds.length
        ? await this.prisma.suppliers.findMany({
            where: { id: { in: supplierIds } },
            select: { id: true, supplier_name: true },
          })
        : [];
      const supplierById = new Map(
        suppliers.map((supplier) => [supplier.id, supplier]),
      );

      const data = stockDetails.flatMap((detail) => {
        if (detail.lot_id === null) return [];

        const lot = lotById.get(detail.lot_id);
        if (!lot) return [];

        return (transactionsByLot.get(detail.lot_id) ?? []).flatMap(
          (transaction) => {
            if (transaction.ref_id === null) return [];

            const purchase = purchaseById.get(transaction.ref_id);
            if (!purchase) return [];

            const supplier = supplierById.get(purchase.supplier_id);
            if (!supplier) return [];

            return [
              {
                id: detail.id,
                lot_no: lot.lot_no,
                qty: detail.qty ?? 0,
                pr_no: transaction.ref_no,
                supplier_name: supplier.supplier_name,
              },
            ];
          },
        );
      });

      return {
        response_code: 200,
        message: 'success',
        data,
      };
    } catch (error: any) {
      return {
        response_code: 400,
        message: error?.message ?? 'Unable to fetch stock details',
      };
    }
  }
}
