import { z } from 'zod';

const id = z.coerce.number().int().positive();

// Common Validation Schemas
export const idParamSchema = id;
export const textParamSchema = z.string().trim().min(1);

export const listQuerySchema = z
  .object({
    id: id.optional(),
    shop_id: id.optional(),
    category_id: id.optional(),
    sub_category_id: id.optional(),
    brand_id: id.optional(),
    unit_id: id.optional(),
    product_code: z.string().optional(),
    product_name: z.string().optional(),
    status: z.coerce.number().int().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

export const saveBodySchema = z
  .object({
    id: id.optional(),
    product_name: z.string().min(1, 'Product name is required'),
    product_code: z.string().optional(),
    product_description: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    category_id: id.optional(),
    sub_category_id: id.optional(),
    brand_id: id.optional(),
    unit_id: id.optional(),
    purchase_price: z.coerce.number().optional(),
    sales_price: z.coerce.number().optional(),
    mrp: z.coerce.number().optional(),
    discount_percent: z.coerce.number().optional(),
    min_stock_alert: z.coerce.number().optional(),
    image: id.optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
    status: z.coerce.number().int().optional(),
  })
  .passthrough();

// TypeScript Types & Interfaces
export type ProductListQuery = z.infer<typeof listQuerySchema>;
export type ProductInput = z.infer<typeof saveBodySchema>;
export type ProductSaveBody = ProductInput;
export type ProductIdParam = z.infer<typeof idParamSchema>;

export interface ProductDetails {
  id?: number | string | bigint;
  product_name: string;
  product_code?: string;
  product_description?: string;
  sku?: string;
  barcode?: string;
  category_id?: number | string | bigint;
  sub_category_id?: number | string | bigint;
  brand_id?: number | string | bigint;
  unit_id?: number | string | bigint;
  purchase_price?: number;
  sales_price?: number;
  mrp?: number;
  discount_percent?: number;
  min_stock_alert?: number;
  image?: number | string | bigint;
  status?: number;
}
