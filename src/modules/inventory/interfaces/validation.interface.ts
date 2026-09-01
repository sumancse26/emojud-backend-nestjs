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
    customer_id: id.optional(),
    supplier_id: id.optional(),
    phone: z.string().optional(),
    invoice_no: z.string().optional(),
    customer_name: z.string().optional(),
    supplier_name: z.string().optional(),
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
    shop_id: id.optional(),
    customer_id: id.optional(),
    supplier_id: id.optional(),
    customer_name: z.string().optional(),
    supplier_name: z.string().optional(),
    invoice_no: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    sales_date: optionalDate,
    total_amount: z.coerce.number().optional(),
    discount_amount: z.coerce.number().optional(),
    vat_amount: z.coerce.number().optional(),
    tax_amount: z.coerce.number().optional(),
    paid_amount: z.coerce.number().optional(),
    due_amount: z.coerce.number().optional(),
    payment_method_id: id.optional(),
    remarks: z.string().optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
    products: z.array(z.record(z.string(), z.unknown())).optional(),
    details: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

// TypeScript Types & Interfaces
export type InventoryListQuery = z.infer<typeof listQuerySchema>;
export type InventorySaveBody = z.infer<typeof saveBodySchema>;
export type InventoryIdParam = z.infer<typeof idParamSchema>;
export type InventoryTextParam = z.infer<typeof textParamSchema>;

export interface CustomerInput {
  id?: number | string | bigint;
  shop_id?: number | string | bigint;
  customer_name: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: number;
}

export interface SupplierInput {
  id?: number | string | bigint;
  shop_id?: number | string | bigint;
  supplier_name: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: number;
}

export interface InvoiceProductItem {
  product_id: number | string | bigint;
  qty: number;
  unit_price: number;
  total_price?: number;
  discount_amount?: number;
}

export interface InvoiceInput {
  id?: number | string | bigint;
  invoice_no?: string;
  shop_id?: number | string | bigint;
  customer_id?: number | string | bigint;
  sales_date?: Date | string;
  total_amount?: number;
  discount_amount?: number;
  paid_amount?: number;
  due_amount?: number;
  payment_method_id?: number | string | bigint;
  remarks?: string;
  status?: number;
  products?: InvoiceProductItem[];
}
