import { z } from 'zod';

const id = z.preprocess((val) => {
  if (
    val === '' ||
    val === null ||
    val === undefined ||
    val === 0 ||
    val === '0'
  ) {
    return undefined;
  }
  return Number(val);
}, z.number().int().positive().optional());

const optionalDate = z.coerce.date().optional();

// Common Validation Schemas
export const idParamSchema = z.coerce.number().int().positive();
export const textParamSchema = z.string().trim().min(1);

// ============================================================================
// Feature: Customers
// ============================================================================
export const saveCustomerSchema = z
  .object({
    id: id.optional(),
    shop_id: id.optional(),
    customer_code: z.string().trim().optional(),
    customer_name: z.string().trim().min(1, 'Customer name is required'),
    phone: z.string().trim().optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    address: z.string().optional(),
    previous_due: z.coerce.number().optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
  })
  .passthrough();

export const customerSchema = saveCustomerSchema;

// ============================================================================
// Feature: Suppliers
// ============================================================================
export const saveSupplierSchema = z
  .object({
    id: id.optional(),
    shop_id: id.optional(),
    supplier_code: z.string().trim().optional(),
    supplier_name: z.string().trim().min(1, 'Supplier name is required'),
    phone: z.string().trim().optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    address: z.string().optional(),
    previous_due: z.coerce.number().optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
  })
  .passthrough();

export const supplierSchema = saveSupplierSchema;

// ============================================================================
// Feature: Invoices
// ============================================================================
export const invoiceProductItemSchema = z
  .object({
    product_id: id,
    qty: z.coerce.number().positive('Quantity must be greater than 0'),
    unit_price: z.coerce.number().min(0).optional(),
    price: z.coerce.number().min(0).optional(),
    total_price: z.coerce.number().optional(),
    discount_amount: z.coerce.number().optional(),
  })
  .passthrough();

export const saveInvoiceSchema = z
  .object({
    id: id.optional(),
    invoice_no: z.string().trim().optional(),
    shop_id: id.optional(),
    customer_id: id.optional(),
    sales_date: optionalDate,
    invoice_date: optionalDate,
    total_amount: z.coerce.number().optional(),
    discount_amount: z.coerce.number().optional(),
    vat_amount: z.coerce.number().optional(),
    tax_amount: z.coerce.number().optional(),
    net_amount: z.coerce.number().optional(),
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

export const invoiceSchema = saveInvoiceSchema;

// Backward-compatible generic schemas
export const saveBodySchema = z
  .object({
    id: id.optional(),
    shop_id: id.optional(),
    customer_id: id.optional(),
    supplier_id: id.optional(),
    customer_code: z.string().optional(),
    supplier_code: z.string().optional(),
    customer_name: z.string().optional(),
    supplier_name: z.string().optional(),
    invoice_no: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    sales_date: optionalDate,
    invoice_date: optionalDate,
    previous_due: z.coerce.number().optional(),
    total_amount: z.coerce.number().optional(),
    discount_amount: z.coerce.number().optional(),
    vat_amount: z.coerce.number().optional(),
    tax_amount: z.coerce.number().optional(),
    net_amount: z.coerce.number().optional(),
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

// ============================================================================
// TypeScript Types & Interfaces
// ============================================================================
export type SaveCustomerInput = z.infer<typeof saveCustomerSchema>;
export type SaveSupplierInput = z.infer<typeof saveSupplierSchema>;
export type SaveInvoiceInput = z.infer<typeof saveInvoiceSchema>;
export type InvoiceProductItemInput = z.infer<typeof invoiceProductItemSchema>;

export type InventoryListQuery = z.infer<typeof listQuerySchema>;
export type InventorySaveBody = z.infer<typeof saveBodySchema>;
export type InventoryIdParam = z.infer<typeof idParamSchema>;
export type InventoryTextParam = z.infer<typeof textParamSchema>;

export interface CustomerInput {
  id?: number | string | bigint;
  shop_id?: number | string | bigint;
  customer_code?: string;
  customer_name: string;
  phone?: string;
  email?: string;
  address?: string;
  previous_due?: number;
  status?: number;
}

export interface SupplierInput {
  id?: number | string | bigint;
  shop_id?: number | string | bigint;
  supplier_code?: string;
  supplier_name: string;
  phone?: string;
  email?: string;
  address?: string;
  previous_due?: number;
  status?: number;
}

export interface InvoiceProductItem {
  product_id: number | string | bigint;
  qty: number;
  unit_price?: number;
  price?: number;
  total_price?: number;
  discount_amount?: number;
}

export interface InvoiceInput {
  id?: number | string | bigint;
  invoice_no?: string;
  shop_id?: number | string | bigint;
  customer_id?: number | string | bigint;
  sales_date?: Date | string;
  invoice_date?: Date | string;
  total_amount?: number;
  discount_amount?: number;
  vat_amount?: number;
  tax_amount?: number;
  net_amount?: number;
  paid_amount?: number;
  due_amount?: number;
  payment_method_id?: number | string | bigint;
  remarks?: string;
  status?: number;
  products?: InvoiceProductItem[];
  details?: InvoiceProductItem[];
}
