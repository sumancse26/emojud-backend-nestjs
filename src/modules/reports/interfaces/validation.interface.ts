import { z } from 'zod';

const id = z.coerce.number().int().positive();
const optionalDate = z.coerce.date().optional();

// Common Validation Schemas
export const idParamSchema = id;
export const reportTypeParamSchema = z.string().trim().min(1);
export const textParamSchema = z.string().trim().min(1);

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

// TypeScript Types & Interfaces
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
