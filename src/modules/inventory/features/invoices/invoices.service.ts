import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.customer_id) where.customer_id = toBigInt(query.customer_id);
    if (query.status !== undefined) where.status = toNumber(query.status);
    if (query.invoice_no)
      where.invoice_no = { contains: String(query.invoice_no), mode: 'insensitive' };

    const data = await this.prisma.invoiceMst.findMany({
      where,
      include: { invoiceDtls: true },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async detail(id: string) {
    const data = await this.prisma.invoiceMst.findUnique({
      where: { id: BigInt(id) },
      include: { invoiceDtls: true },
    });
    if (!data) throw new NotFoundException('Invoice not found');
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const products: any[] = Array.isArray(data.products) ? data.products : [];

    const result = await this.prisma.$transaction(async (tx) => {
      const masterPayload: any = {
        invoice_no: data.invoice_no || `INV-${randomUUID().slice(0, 8).toUpperCase()}`,
        shop_id: toBigInt(data.shop_id) ?? BigInt(1),
        customer_id: toBigInt(data.customer_id) ?? BigInt(1),
        invoice_date: toDate(data.invoice_date) ?? new Date(),
        total_amount: data.total_amount ? Number(data.total_amount) : 0,
        discount_amount: data.discount_amount ? Number(data.discount_amount) : 0,
        vat_amount: data.vat_amount ? Number(data.vat_amount) : 0,
        net_amount: data.net_amount ? Number(data.net_amount) : (data.total_amount ? Number(data.total_amount) : 0),
        paid_amount: data.paid_amount ? Number(data.paid_amount) : 0,
        due_amount: data.due_amount ? Number(data.due_amount) : 0,
        status: toNumber(data.status) ?? 1,
      };

      const master = id
        ? await tx.invoiceMst.update({
            where: { id },
            data: {
              ...masterPayload,
              updated_at: new Date(),
              updated_by: toBigInt(data.updated_by ?? data.login_user_id),
            },
          })
        : await tx.invoiceMst.create({
            data: {
              ...masterPayload,
              created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
            },
          });

      if (id) {
        await tx.invoiceDtl.deleteMany({
          where: { invoice_mst_id: master.id },
        });
      }

      for (const item of products) {
        await tx.invoiceDtl.create({
          data: {
            invoice_mst_id: master.id,
            product_id: toBigInt(item.product_id) ?? BigInt(1),
            qty: item.qty ? Number(item.qty) : 1,
            rate: item.rate ? Number(item.rate) : (item.unit_price ? Number(item.unit_price) : 0),
            disc_amt: item.disc_amt ? Number(item.disc_amt) : (item.discount_amount ? Number(item.discount_amount) : 0),
            vat_amt: item.vat_amt ? Number(item.vat_amt) : 0,
            total_amount: item.total_amount ? Number(item.total_amount) : (item.total_price ? Number(item.total_price) : 0),
          },
        });
      }

      return master;
    });

    return {
      success: true,
      message: id ? 'Invoice updated successfully' : 'Invoice created successfully',
      data: result,
    };
  }
}
