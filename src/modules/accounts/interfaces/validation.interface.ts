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
    year_id: id.optional(),
    month_id: id.optional(),
    invoice_id: id.optional(),
    product_id: id.optional(),
    salary_month: id.optional(),
    salary_year: id.optional(),
    expense_type_id: id.optional(),
    expense_no: z.string().optional(),
    payment_no: z.string().optional(),
    payment_status: z.coerce.number().int().optional(),
    is_received_commission: z.coerce.number().int().optional(),
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
    year_id: id.optional(),
    month_id: id.optional(),
    invoice_id: id.optional(),
    product_id: id.optional(),
    salary_month: id.optional(),
    salary_year: id.optional(),
    expense_no: z.string().optional(),
    payment_no: z.string().optional(),
    process_no: z.string().optional(),
    ref_type: z.coerce.number().optional(),
    ref_id: z.string().optional(),
    ref_purchase_id: z.string().optional(),
    invoice_no: z.string().optional(),
    due_date: optionalDate,
    process_date: optionalDate,
    expense_date: optionalDate,
    payment_date: optionalDate,
    received_date: optionalDate,
    dml_date: optionalDate,
    qty: z.coerce.number().optional(),
    purchase_rate: z.coerce.number().optional(),
    sales_rate: z.coerce.number().optional(),
    profit_amount: z.coerce.number().optional(),
    commission_percent: z.coerce.number().optional(),
    commission_amount: z.coerce.number().optional(),
    is_received_commission: z.coerce.number().int().optional(),
    total_employee: id.optional(),
    total_amount: z.coerce.number().optional(),
    paid_amount: z.coerce.number().optional(),
    due_amount: z.coerce.number().optional(),
    total_paid_amount: z.coerce.number().optional(),
    total_due_amount: z.coerce.number().optional(),
    total_due: z.coerce.number().optional(),
    current_due: z.coerce.number().optional(),
    payment_method_id: id.optional(),
    payment_status: z.coerce.number().int().optional(),
    remarks: z.string().optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
    details: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

// TypeScript Types & Interfaces
export type AccountListQuery = z.infer<typeof listQuerySchema>;
export type AccountSaveBody = z.infer<typeof saveBodySchema>;
export type AccountIdParam = z.infer<typeof idParamSchema>;

export interface ExpenseDetailInput {
  expense_head_id: number | string | bigint;
  amount: number;
  payment_method_id?: number | string | bigint;
  remarks?: string;
}

export interface SalaryProcessDetailInput {
  employee_id: number | string | bigint;
  basic_salary?: number;
  allowance_amount?: number;
  bonus_amount?: number;
  overtime_amount?: number;
  deduction_amount?: number;
  net_salary?: number;
  paid_amount?: number;
  due_amount?: number;
  payment_date?: Date | string;
  payment_method_id?: number | string | bigint;
  remarks?: string;
}

export interface CustomerDueInput {
  id?: number | string | bigint;
  shop_id?: number | string | bigint;
  customer_id?: number | string | bigint;
  ref_type?: number;
  ref_id?: string;
  invoice_no?: string;
  due_date?: Date | string;
  total_amount?: number;
  paid_amount?: number;
  due_amount?: number;
  payment_status?: number;
  remarks?: string;
  status?: number;
}

export interface SupplierPaymentInput {
  id?: number | string | bigint;
  payment_no?: string;
  shop_id?: number | string | bigint;
  supplier_id?: number | string | bigint;
  payment_date?: Date | string;
  ref_purchase_id?: string;
  payment_method_id?: number | string | bigint;
  total_due?: number;
  paid_amount?: number;
  current_due?: number;
  remarks?: string;
  status?: number;
}

export interface CommissionProfitInput {
  id?: number | string | bigint;
  shop_id?: number | string | bigint;
  year_id?: number | string | bigint;
  month_id?: number | string | bigint;
  invoice_id?: number | string | bigint;
  product_id?: number | string | bigint;
  qty?: number;
  purchase_rate?: number;
  sales_rate?: number;
  profit_amount?: number;
  commission_percent?: number;
  commission_amount?: number;
  is_received_commission?: number;
  received_date?: Date | string;
  dml_date?: Date | string;
  status?: number;
}
