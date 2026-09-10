import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(shopId: number) {
    try {
      const data = await this.prisma.products.findMany({
        where: {
          shop_id: shopId,
          status: 1,
        },
        select: {
          id: true,
          product_code: true,
          product_name: true,
          barcode: true,
          purchase_rate: true,
          retail_rate: true,
          sales_rate: true,
          min_stock_qty: true,
          is_batch_wise: true,
          is_expire_wise: true,
          specifications: true,
          category: {
            select: {
              id: true,
              category_name: true,
              parent_category_id: true,
            },
          },
          brand: {
            select: {
              id: true,
              lookup_code: true,
              lookup_value: true,
            },
          },
          units: {
            select: {
              id: true,
              lookup_code: true,
              lookup_value: true,
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

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      product_name: data.product_name,
      product_code:
        data.product_code || `PRD-${randomUUID().slice(0, 8).toUpperCase()}`,
      product_description: data.product_description,
      sku: data.sku,
      barcode: data.barcode,
      category_id: toBigInt(data.category_id),
      sub_category_id: toBigInt(data.sub_category_id),
      brand_id: toBigInt(data.brand_id),
      unit_id: toBigInt(data.unit_id),
      purchase_price: data.purchase_price
        ? Number(data.purchase_price)
        : undefined,
      sales_price: data.sales_price ? Number(data.sales_price) : undefined,
      mrp: data.mrp ? Number(data.mrp) : undefined,
      discount_percent: data.discount_percent
        ? Number(data.discount_percent)
        : undefined,
      min_stock_alert: data.min_stock_alert
        ? Number(data.min_stock_alert)
        : undefined,
      image: toBigInt(data.image),
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.products.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return {
        success: true,
        message: 'Product updated successfully',
        data: updated,
      };
    }

    const created = await this.prisma.products.create({
      data: {
        ...payload,
        created_by:
          toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return {
      success: true,
      message: 'Product created successfully',
      data: created,
    };
  }
}
