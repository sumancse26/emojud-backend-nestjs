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

  async save(data: Record<string, any>, userId: number) {
    try {
      const id = toBigInt(data.id);
      const payload: any = {
        product_name: data.product_name,
        product_code:
          data.product_code || `PRD-${randomUUID().slice(0, 8).toUpperCase()}`,
        specifications: data.specifications,
        barcode: data.barcode,
        category_id: toBigInt(data.category_id),
        sub_category_id: toBigInt(data.sub_category_id),
        brand_id: toBigInt(data.brand_id),
        unit_id: toBigInt(data.unit_id),
        purchase_rate: data.purchase_rate
          ? Number(data.purchase_rate)
          : undefined,
        sales_rate: data.sales_rate ? Number(data.sales_rate) : undefined,
        retail_rate: data.retail_rate ? Number(data.retail_rate) : undefined,

        min_stock_qty: data.min_stock_qty
          ? Number(data.min_stock_qty)
          : undefined,
        image: toBigInt(data.image),
        is_batch_wise: toNumber(data.is_batch_wise) ?? 0,
        is_expire_wise: toNumber(data.is_expire_wise) ?? 0,
        status: toNumber(data.status) ?? 1,
      };

      if (id) {
        const updated = await this.prisma.products.update({
          where: { id },
          data: {
            ...payload,
            updated_at: new Date(),
            updated_by: toBigInt(userId),
          },
        });
        return {
          message: 'Product updated successfully',
          data: { id: updated.id },
        };
      }

      const existed = await this.prisma.products.findFirst({
        where: {
          product_name: {
            equals: data.product_name,
            mode: 'insensitive',
          },
        },
      });

      if (existed) {
        return {
          success: false,
          message: 'Product already exist',
        };
      }
      const created = await this.prisma.products.create({
        data: {
          ...payload,
          created_by: toBigInt(userId),
        },
      });
      return {
        message: 'Product created successfully',
        data: { id: created.id },
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  async shopWiseProductList(shopId: number) {
    try {
      const products = await this.prisma.products.findMany({
        where: {
          shop_id: shopId,
        },
        select: {
          id: true,
          product_code: true,
          product_name: true,
          purchase_rate: true,
          retail_rate: true,
          sales_rate: true,
        },
      });

      const productList = await Promise.all(
        products.map(async (prod) => {
          const stock = await this.prisma.stockMst.findFirst({
            where: {
              shop_id: shopId,
              prod_id: prod.id,
            },
          });

          return {
            ...prod,
            avail_stock: stock?.current_stock ?? 0,
          };
        }),
      );

      return {
        message: 'Fetched products list',
        data: productList,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
