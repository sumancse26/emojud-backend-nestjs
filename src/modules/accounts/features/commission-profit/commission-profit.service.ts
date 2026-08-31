import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class CommissionProfitService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.year_id) where.year_id = toBigInt(query.year_id);
    if (query.month_id) where.month_id = toBigInt(query.month_id);
    if (query.invoice_id) where.invoice_id = toBigInt(query.invoice_id);
    if (query.product_id) where.product_id = toBigInt(query.product_id);
    if (query.is_received_commission !== undefined)
      where.is_received_commission = toNumber(query.is_received_commission);
    if (query.status !== undefined) where.status = toNumber(query.status);

    const data = await this.prisma.shopWiseCommissionProfit.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      shop_id: toBigInt(data.shop_id) ?? BigInt(1),
      year_id: toBigInt(data.year_id),
      month_id: toBigInt(data.month_id),
      invoice_id: toBigInt(data.invoice_id),
      product_id: toBigInt(data.product_id),
      qty: data.qty ? Number(data.qty) : 0,
      purchase_rate: data.purchase_rate ? Number(data.purchase_rate) : 0,
      sales_rate: data.sales_rate ? Number(data.sales_rate) : 0,
      profit_amount: data.profit_amount ? Number(data.profit_amount) : 0,
      commission_percent: data.commission_percent ? Number(data.commission_percent) : 0,
      commission_amount: data.commission_amount ? Number(data.commission_amount) : 0,
      is_received_commission: toNumber(data.is_received_commission) ?? 0,
      received_date: toDate(data.received_date),
      dml_date: toDate(data.dml_date),
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.shopWiseCommissionProfit.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return { success: true, message: 'Commission profit updated successfully', data: updated };
    }

    const created = await this.prisma.shopWiseCommissionProfit.create({
      data: {
        ...payload,
        created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return { success: true, message: 'Commission profit created successfully', data: created };
  }
}
