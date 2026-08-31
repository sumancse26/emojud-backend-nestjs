import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.category_id) where.category_id = toBigInt(query.category_id);
    if (query.sub_category_id) where.sub_category_id = toBigInt(query.sub_category_id);
    if (query.brand_id) where.brand_id = toBigInt(query.brand_id);
    if (query.product_code) where.product_code = String(query.product_code);
    if (query.product_name)
      where.product_name = { contains: String(query.product_name), mode: 'insensitive' };
    if (query.status !== undefined) where.status = toNumber(query.status);

    const data = await this.prisma.products.findMany({
      where,
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      product_name: data.product_name,
      product_code: data.product_code || `PRD-${randomUUID().slice(0, 8).toUpperCase()}`,
      product_description: data.product_description,
      sku: data.sku,
      barcode: data.barcode,
      category_id: toBigInt(data.category_id),
      sub_category_id: toBigInt(data.sub_category_id),
      brand_id: toBigInt(data.brand_id),
      unit_id: toBigInt(data.unit_id),
      purchase_price: data.purchase_price ? Number(data.purchase_price) : undefined,
      sales_price: data.sales_price ? Number(data.sales_price) : undefined,
      mrp: data.mrp ? Number(data.mrp) : undefined,
      discount_percent: data.discount_percent ? Number(data.discount_percent) : undefined,
      min_stock_alert: data.min_stock_alert ? Number(data.min_stock_alert) : undefined,
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
      return { success: true, message: 'Product updated successfully', data: updated };
    }

    const created = await this.prisma.products.create({
      data: {
        ...payload,
        created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return { success: true, message: 'Product created successfully', data: created };
  }
}
