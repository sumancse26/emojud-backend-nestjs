import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class SupplierPaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async dueList(shopId: number) {
    try {
      const where = {
        shop_id: shopId,
        due_amount: { gt: 0 },
        is_confirm: 1,
      };

      const [data, totalPurchase, dueSummary] = await this.prisma.$transaction([
        this.prisma.purchaseMst.findMany({
          where,
          select: {
            id: true,
            purchase_no: true,
            purchase_date: true,
            due_amount: true,
            supplier: {
              select: {
                id: true,
                supplier_code: true,
                supplier_name: true,
                phone: true,
              },
            },
          },
          orderBy: { purchase_date: 'desc' },
        }),

        this.prisma.purchaseMst.count({ where }),

        this.prisma.purchaseMst.aggregate({
          where,
          _sum: {
            due_amount: true,
            total_amount: true,
          },
        }),
      ]);

      return {
        success: true,
        data,
        summary: {
          no_of_purchase: totalPurchase,
          total_due: dueSummary._sum.due_amount ?? 0,
          total_purchase: dueSummary._sum.due_amount ?? 0,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  async list(shopId: number) {
    try {
      const data = await this.prisma.supplierPayment.findMany({
        where: { shop_id: shopId, status: 1 },
        select: {
          id: true,
          payment_no: true,
          payment_date: true,
          total_due: true,
          paid_amount: true,
          current_due: true,
          remarks: true,
          supplierPayment: {
            select: {
              id: true,
              supplier_code: true,
              supplier_name: true,
              phone: true,
            },
          },
        },
        orderBy: { id: 'desc' },
      });
      return { success: true, data };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async pendingDueList(shopId: number) {
    try {
      const data = await this.prisma.suppliers.findMany({
        where: { shop_id: shopId, previous_due: { gt: 0 } },
        select: {
          id: true,
          supplier_code: true,
          supplier_name: true,
          phone: true,
          email: true,
          address: true,
          previous_due: true,
        },
        orderBy: { supplier_name: 'asc' },
      });
      return { success: true, data };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const shopId = toBigInt(data.shop_id) ?? BigInt(1);
    const supplierId = toBigInt(data.supplier_id) ?? BigInt(1);
    const paidAmount = data.paid_amount ? Number(data.paid_amount) : 0;

    const payload: any = {
      shop_id: shopId,
      supplier_id: supplierId,
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
      const updated = await this.prisma.$transaction(async (tx) => {
        // The procedure updates only the payment row when an id is supplied.
        return tx.supplierPayment.update({
          where: { id },
          data: {
            payment_date: payload.payment_date,
            payment_method_id: payload.payment_method_id,
            total_due: payload.total_due,
            paid_amount: payload.paid_amount,
            current_due: payload.current_due,
            remarks: payload.remarks,
            updated_at: new Date(),
            updated_by: toBigInt(data.updated_by ?? data.login_user_id),
          },
        });
      });

      return {
        success: true,
        message: 'Supplier payment updated successfully',
        id: updated.id,
      };
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.supplierPayment.create({
        data: {
          ...payload,
          // Generate the same format as the procedure after the database id
          // has been assigned. This also avoids MAX(id) race conditions.
          payment_no: data.payment_no || undefined,
          created_by:
            toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
        },
      });

      const paymentNo =
        data.payment_no || `SP-${payment.id.toString().padStart(8, '0')}`;

      const paymentWithNo = data.payment_no
        ? payment
        : await tx.supplierPayment.update({
            where: { id: payment.id },
            data: { payment_no: paymentNo },
          });

      if (
        data.ref_purchase_id !== null &&
        data.ref_purchase_id !== undefined &&
        data.ref_purchase_id !== ''
      ) {
        const purchaseId = toBigInt(data.ref_purchase_id);

        if (!purchaseId) {
          throw new Error('Invalid ref_purchase_id');
        }

        await tx.purchaseMst.update({
          where: { id: purchaseId },
          data: {
            due_amount: { decrement: paidAmount },
            paid_amount: { increment: paidAmount },
          },
        });

        await tx.suppliers.update({
          where: { id: supplierId },
          data: {
            previous_due: { decrement: paidAmount },
          },
        });
      }

      return paymentWithNo;
    });

    return {
      success: true,
      message: 'Supplier payment created successfully',
      id: created.id,
    };
  }
}
