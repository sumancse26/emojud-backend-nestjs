import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(shopId: number) {
    try {
      const data = await this.prisma.expenseMst.findMany({
        where: { shop_id: shopId },
        select: {
          id: true,
          expense_no: true,
          expense_date: true,
          remarks: true,
        },
        orderBy: { id: 'desc' },
      });
      return { message: 'Fetch successful', data };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async detail(id: number) {
    try {
      const data = await this.prisma.expenseDtl.findMany({
        where: { expense_mst_id: BigInt(id) },
        select: {
          id: true,
          amount: true,
          remarks: true,
          expenseMst: {
            select: {
              id: true,
              expense_no: true,
              expense_date: true,
            },
          },
          expenseHead: {
            select: {
              id: true,
              lookup_code: true,
              lookup_value: true,
            },
          },
          paymentMethod: {
            select: {
              id: true,
              lookup_code: true,
              lookup_value: true,
            },
          },
        },
      });
      if (!data) throw new NotFoundException('Expense not found');
      return { message: 'Fetch successful', data };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async save(data: Record<string, any>, userId: number) {
    try {
      const id = toBigInt(data.id);
      const details: any[] = Array.isArray(data.details) ? data.details : [];

      const result = await this.prisma.$transaction(async (tx) => {
        const masterPayload: any = {
          expense_no:
            data.expense_no || `EXP-${randomUUID().slice(0, 8).toUpperCase()}`,
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
                created_by: toBigInt(userId),
              },
            });

        if (id) {
          await tx.expenseDtl.deleteMany({
            where: { expense_mst_id: master.id },
          });
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
        message: id
          ? 'Expense updated successfully'
          : 'Expense created successfully',
        data: { id: result.id },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
