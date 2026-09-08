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
export const reportTypeParamSchema = z.string().trim().min(1);
export const textParamSchema = z.string().trim().min(1);

// ============================================================================
// Feature: Report Queries
// ============================================================================
export const dateRangeQuerySchema = z
  .object({
    shop_id: id.optional(),
    from_date: optionalDate,
    to_date: optionalDate,
    status: z.coerce.number().int().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

export const productLedgerQuerySchema = z
  .object({
    product_id: id.optional(),
    shop_id: id.optional(),
    from_date: optionalDate,
    to_date: optionalDate,
    status: z.coerce.number().int().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

export const partyDueQuerySchema = z
  .object({
    customer_id: id.optional(),
    supplier_id: id.optional(),
    shop_id: id.optional(),
    from_date: optionalDate,
    to_date: optionalDate,
    status: z.coerce.number().int().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

export const listQuerySchema = z
  .object({
    id: id.optional(),
    shop_id: id.optional(),
    product_id: id.optional(),
    customer_id: id.optional(),
    supplier_id: id.optional(),
    from_date: optionalDate,
    to_date: optionalDate,
    status: z.coerce.number().int().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

export const reportQuerySchema = listQuerySchema;

// ============================================================================
// TypeScript Types & Interfaces
// ============================================================================
export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;
export type ProductLedgerQuery = z.infer<typeof productLedgerQuerySchema>;
export type PartyDueQuery = z.infer<typeof partyDueQuerySchema>;
export type ReportQuery = z.infer<typeof listQuerySchema>;
export type ReportListQuery = ReportQuery;
export type ReportIdParam = z.infer<typeof idParamSchema>;
export type ReportTypeParam = z.infer<typeof reportTypeParamSchema>;

export interface ReportFilterOptions {
  shop_id?: number | string | bigint;
  product_id?: number | string | bigint;
  customer_id?: number | string | bigint;
  supplier_id?: number | string | bigint;
  from_date?: Date | string;
  to_date?: Date | string;
  status?: number;
}
