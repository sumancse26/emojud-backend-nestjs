import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(shopId: number) {
    try {
      const data = await this.prisma.invoiceMst.findMany({
        where: { shop_id: shopId, status: 1 },
        select: {
          id: true,
          invoice_no: true,
          invoice_date: true,
          total_amount: true,
          discount_amount: true,
          vat_amount: true,
          net_amount: true,
          paid_amount: true,
          due_amount: true,

          customer: {
            select: {
              id: true,
              customer_code: true,
              customer_name: true,
            },
          },
          shop: {
            select: {
              id: true,
              display_code: true,
              shop_name: true,
            },
          },
          tranStatus: {
            select: {
              id: true,
              lookup_code: true,
            },
          },
        },
        orderBy: { id: 'desc' },
      });
      return { data };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async detail(query: Record<string, any>) {
    try {
      const data = await this.prisma.invoiceMst.findUnique({
        where: { id: BigInt(query.inv_id), shop_id: query.shop_id, status: 1 },
        select: {
          id: true,
          invoice_no: true,
          invoice_date: true,
          total_amount: true,
          discount_amount: true,
          vat_amount: true,
          net_amount: true,
          invoiceDtls: {
            select: {
              id: true,
              qty: true,
              rate: true,
              vat_amt: true,
              disc_amt: true,
              total_amount: true,
              product: {
                select: {
                  id: true,
                  product_code: true,
                  product_name: true,
                  purchase_rate: true,
                  retail_rate: true,
                  sales_rate: true,
                },
              },
            },
          },
          customer: {
            select: {
              id: true,
              customer_code: true,
              customer_name: true,
            },
          },
          tranStatus: {
            select: {
              id: true,
              lookup_code: true,
            },
          },
          shop: {
            select: {
              id: true,
              display_code: true,
              shop_name: true,
            },
          },
        },
      });
      if (!data) throw new NotFoundException('Invoice not found');
      return { data };
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
      const products: any[] = Array.isArray(data.products) ? data.products : [];

      const result = await this.prisma.$transaction(async (tx) => {
        const masterPayload: any = {
          invoice_no:
            data.invoice_no || `INV-${randomUUID().slice(0, 8).toUpperCase()}`,
          shop_id: toBigInt(data.shop_id) ?? BigInt(1),
          customer_id: toBigInt(data.customer_id) ?? BigInt(1),
          invoice_date: toDate(data.invoice_date) ?? new Date(),
          total_amount: data.total_amount ? Number(data.total_amount) : 0,
          discount_amount: data.discount_amount
            ? Number(data.discount_amount)
            : 0,
          vat_amount: data.vat_amount ? Number(data.vat_amount) : 0,
          net_amount: data.net_amount
            ? Number(data.net_amount)
            : data.total_amount
              ? Number(data.total_amount)
              : 0,
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
                updated_by: toBigInt(userId),
              },
            })
          : await tx.invoiceMst.create({
              data: {
                ...masterPayload,
                created_by: toBigInt(userId),
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
              qty: Number(item.qty),
              rate: item.rate
                ? Number(item.rate)
                : item.unit_price
                  ? Number(item.unit_price)
                  : 0,
              disc_amt: item.disc_amt
                ? Number(item.disc_amt)
                : item.discount_amount
                  ? Number(item.discount_amount)
                  : 0,
              vat_amt: item.vat_amt ? Number(item.vat_amt) : 0,
              total_amount: item.total_amount
                ? Number(item.total_amount)
                : item.total_price
                  ? Number(item.total_price)
                  : 0,
            },
          });
        }

        return master;
      });

      return {
        message: id
          ? 'Invoice updated successfully'
          : 'Invoice created successfully',
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
