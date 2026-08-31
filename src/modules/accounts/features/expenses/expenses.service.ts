import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.status !== undefined) where.status = toNumber(query.status);
    if (query.expense_no)
      where.expense_no = { contains: String(query.expense_no), mode: 'insensitive' };

    const data = await this.prisma.expenseMst.findMany({
      where,
      include: { expenseDtls: true },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async detail(id: string) {
    const data = await this.prisma.expenseMst.findUnique({
      where: { id: BigInt(id) },
      include: { expenseDtls: true, shop: true },
    });
    if (!data) throw new NotFoundException('Expense not found');
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const details: any[] = Array.isArray(data.details) ? data.details : [];

    const result = await this.prisma.$transaction(async (tx) => {
      const masterPayload: any = {
        expense_no: data.expense_no || `EXP-${randomUUID().slice(0, 8).toUpperCase()}`,
        shop_id: toBigInt(data.shop_id) ?? BigInt(1),
        expense_date: toDate(data.expense_date) ?? new Date(),
        total_amount: data.total_amount ? Number(data.total_amount) : 0,
        remarks: data.remarks,
        status: toNumber(data.status) ?? 1,
      };

      const master = id
        ? await tx.expenseMst.update({
            where: { id },
            data: { ...masterPayload },
          })
        : await tx.expenseMst.create({
            data: {
              ...masterPayload,
              created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
            },
          });

      if (id) {
        await tx.expenseDtl.deleteMany({ where: { expense_mst_id: master.id } });
      }

      for (const item of details) {
        await tx.expenseDtl.create({
          data: {
            expense_mst_id: master.id,
            expense_head_id: toBigInt(item.expense_head_id) ?? BigInt(1),
            amount: item.amount ? Number(item.amount) : 0,
            payment_method_id: toBigInt(item.payment_method_id),
            remarks: item.remarks,
          },
        });
      }

      return master;
    });

    return {
      success: true,
      message: id ? 'Expense updated successfully' : 'Expense created successfully',
      data: result,
    };
  }
}
