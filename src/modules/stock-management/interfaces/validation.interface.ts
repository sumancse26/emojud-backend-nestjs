import { z } from 'zod';

const id = z.coerce.number().int().positive();
const optionalDate = z.coerce.date().optional();

// Common Validation Schemas
export const idParamSchema = id;
export const textParamSchema = z.string().trim().min(1);

export const listQuerySchema = z
  .object({
    id: id.optional(),
    shop_id: id.optional(),
    warehouse_id: id.optional(),
    supplier_id: id.optional(),
    prod_id: id.optional(),
    product_id: id.optional(),
    purchase_no: z.string().optional(),
    status: z.coerce.number().int().optional(),
    from_date: optionalDate,
    to_date: optionalDate,
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

export const saveBodySchema = z
  .object({
    id: id.optional(),
    purchase_no: z.string().optional(),
    shop_id: id.optional(),
    warehouse_id: id.optional(),
    supplier_id: id.optional(),
    prod_id: id.optional(),
    product_id: id.optional(),
    purchase_date: optionalDate,
    challan_no: z.string().optional(),
    challan_date: optionalDate,
    total_amount: z.coerce.number().optional(),
    paid_amount: z.coerce.number().optional(),
    due_amount: z.coerce.number().optional(),
    discount_amount: z.coerce.number().optional(),
    remarks: z.string().optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
    details: z.array(z.record(z.string(), z.unknown())).optional(),
    products: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

// TypeScript Types & Interfaces
export type StockListQuery = z.infer<typeof listQuerySchema>;
export type StockSaveBody = z.infer<typeof saveBodySchema>;
export type StockIdParam = z.infer<typeof idParamSchema>;

export interface PurchaseDetailItem {
  product_id: number | string | bigint;
  qty: number;
  purchase_rate?: number;
  unit_price?: number;
  retail_rate?: number;
  sales_rate?: number;
  total_amount?: number;
}

export interface PurchaseMasterInput {
  id?: number | string | bigint;
  purchase_no?: string;
  shop_id?: number | string | bigint;
  warehouse_id?: number | string | bigint;
  supplier_id?: number | string | bigint;
  purchase_date?: Date | string;
  challan_no?: string;
  challan_date?: Date | string;
  total_amount?: number;
  paid_amount?: number;
  due_amount?: number;
  discount_amount?: number;
  remarks?: string;
  status?: number;
  details?: PurchaseDetailItem[];
}

export interface StockSummaryQuery {
  id?: number | string | bigint;
  shop_id?: number | string | bigint;
  warehouse_id?: number | string | bigint;
  supplier_id?: number | string | bigint;
  prod_id?: number | string | bigint;
  product_id?: number | string | bigint;
  status?: number;
}
