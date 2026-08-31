import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt } from 'src/common/utils/prisma.util';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async report(type: string, query: Record<string, any> = {}) {
    const from = query.from_date ? new Date(query.from_date) : new Date('1970-01-01');
    const to = query.to_date ? new Date(query.to_date) : new Date('2999-12-31');

    if (type === 'daily-sales' || type === 'gross-profit') {
      const rows = await this.prisma.invoiceMst.findMany({
        where: { invoice_date: { gte: from, lte: to }, status: 1 },
        include: { invoiceDtls: true },
        orderBy: { id: 'desc' },
      });
      return { success: true, data: rows };
    }

    if (type === 'daily-purchase') {
      const rows = await this.prisma.purchaseMst.findMany({
        where: { purchase_date: { gte: from, lte: to }, status: 1 },
        include: { purchaseDtls: true },
        orderBy: { id: 'desc' },
      });
      return { success: true, data: rows };
    }

    if (type === 'daily-expense') {
      const rows = await this.prisma.expenseMst.findMany({
        where: { expense_date: { gte: from, lte: to }, status: 1 },
        include: { expenseDtls: true },
        orderBy: { id: 'desc' },
      });
      return { success: true, data: rows };
    }

    if (type === 'product-ledger') {
      const where: any = {};
      if (query.product_id) where.product_id = toBigInt(query.product_id);
      const rows = await this.prisma.stockTransaction.findMany({
        where,
        orderBy: { id: 'desc' },
      });
      return { success: true, data: rows };
    }

    if (type === 'customer-due' || type === 'collection' || type === 'cash-flow') {
      const rows = await this.prisma.customerDue.findMany({
        where: { status: 1 },
        orderBy: { id: 'desc' },
      });
      return { success: true, data: rows };
    }

    if (type === 'supplier-due') {
      const rows = await this.prisma.supplierPayment.findMany({
        where: { status: 1 },
        orderBy: { id: 'desc' },
      });
      return { success: true, data: rows };
    }

    if (type === 'stock-summary') {
      const rows = await this.prisma.stockMst.findMany({
        where: { status: 1 },
        include: { stockDtls: true },
        orderBy: { id: 'desc' },
      });
      return { success: true, data: rows };
    }

    throw new BadRequestException(`Unsupported report: ${type}`);
  }
}
