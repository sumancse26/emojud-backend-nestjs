import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.supplier_id) where.supplier_id = toBigInt(query.supplier_id);
    if (query.status !== undefined) where.status = toNumber(query.status);
    if (query.purchase_no)
      where.purchase_no = { contains: String(query.purchase_no), mode: 'insensitive' };

    const data = await this.prisma.purchaseMst.findMany({
      where,
      include: { purchaseDtls: true },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async detail(id: string) {
    const data = await this.prisma.purchaseMst.findUnique({
      where: { id: BigInt(id) },
      include: { purchaseDtls: true },
    });
    if (!data) throw new NotFoundException('Purchase not found');
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const details: any[] = Array.isArray(data.details ?? data.products)
      ? data.details ?? data.products
      : [];

    const result = await this.prisma.$transaction(async (tx) => {
      const masterPayload: any = {
        purchase_no: data.purchase_no || `PUR-${randomUUID().slice(0, 8).toUpperCase()}`,
        shop_id: toBigInt(data.shop_id) ?? BigInt(1),
        warehouse_id: toBigInt(data.warehouse_id) ?? BigInt(1),
        supplier_id: toBigInt(data.supplier_id) ?? BigInt(1),
        purchase_date: toDate(data.purchase_date) ?? new Date(),
        challan_no: data.challan_no,
        challan_date: toDate(data.challan_date),
        total_amount: data.total_amount ? Number(data.total_amount) : 0,
        paid_amount: data.paid_amount ? Number(data.paid_amount) : 0,
        due_amount: data.due_amount ? Number(data.due_amount) : 0,
        discount_amount: data.discount_amount ? Number(data.discount_amount) : 0,
        remarks: data.remarks,
        status: toNumber(data.status) ?? 1,
      };

      const master = id
        ? await tx.purchaseMst.update({
            where: { id },
            data: {
              ...masterPayload,
              updated_at: new Date(),
              updated_by: toBigInt(data.updated_by ?? data.login_user_id),
            },
          })
        : await tx.purchaseMst.create({
            data: {
              ...masterPayload,
              created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
            },
          });

      if (id) {
        await tx.purchaseDtl.deleteMany({
          where: { purchase_mst_id: master.id },
        });
      }

      for (const item of details) {
        await tx.purchaseDtl.create({
          data: {
            purchase_mst_id: master.id,
            product_id: toBigInt(item.product_id) ?? BigInt(1),
            qty: item.qty ? Number(item.qty) : 1,
            purchase_rate: item.purchase_rate ? Number(item.purchase_rate) : (item.unit_price ? Number(item.unit_price) : 0),
            retail_rate: item.retail_rate ? Number(item.retail_rate) : 0,
            sales_rate: item.sales_rate ? Number(item.sales_rate) : 0,
            total_amount: item.total_amount ? Number(item.total_amount) : 0,
          },
        });
      }

      return master;
    });

    return {
      success: true,
      message: id ? 'Purchase updated successfully' : 'Purchase created successfully',
      data: result,
    };
  }
}
