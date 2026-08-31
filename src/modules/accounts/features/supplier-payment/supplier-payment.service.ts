import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class SupplierPaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.supplier_id) where.supplier_id = toBigInt(query.supplier_id);
    if (query.status !== undefined) where.status = toNumber(query.status);
    if (query.payment_no)
      where.payment_no = { contains: String(query.payment_no), mode: 'insensitive' };

    const data = await this.prisma.supplierPayment.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      payment_no: data.payment_no || `SP-${randomUUID().slice(0, 8).toUpperCase()}`,
      shop_id: toBigInt(data.shop_id) ?? BigInt(1),
      supplier_id: toBigInt(data.supplier_id) ?? BigInt(1),
      payment_date: toDate(data.payment_date) ?? new Date(),
      ref_purchase_id: data.ref_purchase_id,
      payment_method_id: toBigInt(data.payment_method_id),
      total_due: data.total_due ? Number(data.total_due) : 0,
      paid_amount: data.paid_amount ? Number(data.paid_amount) : 0,
      current_due: data.current_due ? Number(data.current_due) : 0,
      remarks: data.remarks,
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.supplierPayment.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return { success: true, message: 'Supplier payment updated successfully', data: updated };
    }

    const created = await this.prisma.supplierPayment.create({
      data: {
        ...payload,
        created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return { success: true, message: 'Supplier payment created successfully', data: created };
  }
}
