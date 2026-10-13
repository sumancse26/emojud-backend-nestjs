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
          status: true,
          is_submit: true,
          tran_status: true,

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
          paid_amount: true,
          due_amount: true,
          status: true,
          tran_status: true,
          is_submit: true,
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
      const shopId = toBigInt(data.shop_id);
      const customerId = toBigInt(data.customer_id);
      const isSubmit = toNumber(data.is_submit) ?? 0;
      const products: any[] = Array.isArray(data.products)
        ? data.products
        : Array.isArray(data.details)
          ? data.details
          : [];

      if (!shopId || !customerId) {
        return {
          success: false,
          response_code: 400,
          message: 'shop_id and customer_id are required',
        };
      }

      if (isSubmit !== 0 && isSubmit !== 1) {
        return {
          success: false,
          response_code: 400,
          message: 'is_submit must be either 0 (draft) or 1 (final submit)',
        };
      }

      // Keep invoice statuses consistent with purchase statuses:
      // 18 = draft, 19 = final submitted.
      const transactionStatus = isSubmit === 1 ? BigInt(19) : BigInt(18);

      const [shop, customer] = await Promise.all([
        this.prisma.shop.findUnique({
          where: { id: shopId },
          select: { id: true },
        }),
        this.prisma.customers.findUnique({
          where: { id: customerId },
          select: { id: true, shop_id: true },
        }),
      ]);

      if (!shop) {
        return {
          success: false,
          response_code: 400,
          message: `Shop with id ${shopId.toString()} was not found`,
        };
      }

      if (!customer) {
        return {
          success: false,
          response_code: 400,
          message: `Customer with id ${customerId.toString()} was not found`,
        };
      }

      if (customer.shop_id && customer.shop_id !== shopId) {
        return {
          success: false,
          response_code: 400,
          message: `Customer with id ${customerId.toString()} does not belong to shop ${shopId.toString()}`,
        };
      }

      const result = await this.prisma.$transaction(async (tx) => {
        const masterPayload: any = {
          invoice_no:
            data.invoice_no || `INV-${randomUUID().slice(0, 8).toUpperCase()}`,
          shop_id: shopId,
          customer_id: customerId,
          invoice_date: toDate(data.invoice_date) ?? new Date(),
          total_amount: toNumber(data.total_amount) ?? 0,
          discount_amount: toNumber(data.discount_amount) ?? 0,
          vat_amount: toNumber(data.vat_amount) ?? 0,
          net_amount:
            toNumber(data.net_amount) ?? toNumber(data.total_amount) ?? 0,
          paid_amount: toNumber(data.paid_amount) ?? 0,
          due_amount: toNumber(data.due_amount) ?? 0,
          status: toNumber(data.status) ?? 1,
          is_submit: BigInt(isSubmit),
          tran_status: transactionStatus,
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
          const productId = toBigInt(item.product_id);

          if (!productId) {
            throw new Error('product_id is required for every invoice item');
          }

          await tx.invoiceDtl.create({
            data: {
              invoice_mst_id: master.id,
              product_id: productId,
              qty: toNumber(item.qty) ?? 0,
              rate: toNumber(item.rate) ?? toNumber(item.unit_price) ?? 0,
              disc_amt:
                toNumber(item.disc_amt) ?? toNumber(item.discount_amount) ?? 0,
              vat_amt: toNumber(item.vat_amt) ?? 0,
              total_amount:
                toNumber(item.total_amount) ?? toNumber(item.total_price) ?? 0,
            },
          });
        }

        return master;
      });

      return {
        success: true,
        message: id
          ? 'Invoice updated successfully'
          : 'Invoice created successfully',
        data: {
          id: result.id,
          status: result.status,
          tran_status: result.tran_status,
          is_submit: result.is_submit,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        response_code: 500,
        message: err.message,
      };
    }
  }
}
