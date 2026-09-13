import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';
import type { customerDueType } from './dto/customer-due.dto';

@Injectable()
export class CustomerDueService {
  constructor(private readonly prisma: PrismaService) {}

  async list(shopId: number) {
    const data = await this.prisma.customerDue.findMany({
      where: { shop_id: shopId, status: 1 },
      select: {
        id: true,
        invoice_no: true,
        due_date: true,
        total_amount: true,
        paid_amount: true,
        due_amount: true,
        payment_status: true,
        remarks: true,
        due_cust_info: {
          select: {
            id: true,
            customer_name: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });
    return { message: 'Fetch successful', data };
  }

  async pendingDueList(shopId: number) {
    const data = await this.prisma.customers.findMany({
      where: { shop_id: shopId, previous_due: { gt: 0 }, status: 1 },
      omit: {
        status: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
      },
      orderBy: { id: 'desc' },
    });
    return { message: 'Fetch successful', data };
  }
  async invoiceDueList(shopId: number) {
    const data = await this.prisma.invoiceMst.findMany({
      where: { shop_id: shopId, due_amount: { gt: 0 }, is_submit: 1 },
      select: {
        id: true,
        invoice_no: true,
        customer_id: true,
        due_amount: true,
      },
      orderBy: { id: 'desc' },
    });
    const totaldueAmt = await this.prisma.invoiceMst.aggregate({
      _sum: {
        due_amount: true,
      },
    });
    return {
      message: 'Fetch successful',
      data,
      summary: {
        total_invoice: data.length || 0,
        total_due: totaldueAmt?._sum?.due_amount || 0,
      },
    };
  }

  async save(data: customerDueType, userId: number) {
    const id = toBigInt(data.id);
    const shopId = toBigInt(data.shop_id) ?? BigInt(1);
    const customerId = toBigInt(data.customer_id);

    if (!customerId) {
      throw new BadRequestException('A valid customer_id is required');
    }
    const paidAmount =
      data.paid_amount === undefined || data.paid_amount === null
        ? 0
        : Number(data.paid_amount);

    if (id) {
      const updated = await this.prisma.$transaction(async (tx) => {
        const customer = await tx.customers.findUnique({
          where: { id: customerId },
          select: { id: true },
        });

        if (!customer) {
          throw new BadRequestException(
            `Customer with id ${customerId.toString()} was not found`,
          );
        }

        return tx.customerDue.update({
          where: { id },
          // Equivalent to the procedure's UPDATE branch. The procedure does
          // not update shop_id, ref_type, ref_id, invoice_no, or status.
          data: {
            customer_id: customerId,
            due_date: toDate(data.due_date) ?? new Date(),
            total_amount:
              data.total_amount === undefined || data.total_amount === null
                ? 0
                : Number(data.total_amount),
            paid_amount: paidAmount,
            due_amount:
              data.due_amount === undefined || data.due_amount === null
                ? 0
                : Number(data.due_amount),
            payment_status: toNumber(data.payment_status) ?? 0,
            remarks: data.remarks,
            updated_at: new Date(),
            updated_by: userId,
          },
        });
      });

      return {
        message: 'Customer due updated successfully',
        data: { id: updated.id },
      };
    }

    const created = await this.prisma.$transaction(async (tx) => {
      const customer = await tx.customers.findUnique({
        where: { id: customerId },
        select: { id: true },
      });

      if (!customer) {
        throw new BadRequestException(
          `Customer with id ${customerId.toString()} was not found`,
        );
      }

      const customerDue = await tx.customerDue.create({
        data: {
          shop_id: shopId,
          customer_id: customerId,
          ref_type: toNumber(data.ref_type),
          ref_id: data.ref_id,
          invoice_no: data.invoice_no,
          due_date: toDate(data.due_date) ?? new Date(),
          total_amount:
            data.total_amount === undefined || data.total_amount === null
              ? 0
              : Number(data.total_amount),
          paid_amount: paidAmount,
          due_amount:
            data.due_amount === undefined || data.due_amount === null
              ? 0
              : Number(data.due_amount),
          payment_status: toNumber(data.payment_status) ?? 0,
          remarks: data.remarks,
          created_by: userId,
        },
      });

      if (
        data.ref_id !== null &&
        data.ref_id !== undefined &&
        data.ref_id !== ''
      ) {
        const invoiceId = toBigInt(data.ref_id);

        if (!invoiceId) {
          throw new Error('Invalid ref_id');
        }

        await tx.invoiceMst.update({
          where: { id: invoiceId },
          data: {
            due_amount: { decrement: paidAmount },
            paid_amount: { increment: paidAmount },
          },
        });

        await tx.customers.update({
          where: { id: customerId },
          data: {
            previous_due: { decrement: paidAmount },
          },
        });
      }

      return customerDue;
    });

    return {
      message: 'Customer due created successfully',
      data: { id: created.id },
    };
  }
}
