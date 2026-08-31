import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class CustomerDueService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.customer_id) where.customer_id = toBigInt(query.customer_id);
    if (query.payment_status !== undefined)
      where.payment_status = toNumber(query.payment_status);
    if (query.status !== undefined) where.status = toNumber(query.status);

    const data = await this.prisma.customerDue.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      shop_id: toBigInt(data.shop_id) ?? BigInt(1),
      customer_id: toBigInt(data.customer_id) ?? BigInt(1),
      ref_type: toNumber(data.ref_type),
      ref_id: data.ref_id,
      invoice_no: data.invoice_no,
      due_date: toDate(data.due_date) ?? new Date(),
      total_amount: data.total_amount ? Number(data.total_amount) : 0,
      paid_amount: data.paid_amount ? Number(data.paid_amount) : 0,
      due_amount: data.due_amount ? Number(data.due_amount) : 0,
      payment_status: toNumber(data.payment_status) ?? 0,
      remarks: data.remarks,
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.customerDue.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return { success: true, message: 'Customer due updated successfully', data: updated };
    }

    const created = await this.prisma.customerDue.create({
      data: {
        ...payload,
        created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return { success: true, message: 'Customer due created successfully', data: created };
  }
}
