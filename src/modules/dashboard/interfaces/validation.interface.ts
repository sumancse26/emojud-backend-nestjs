import { z } from 'zod';

const id = z.coerce.number().int().positive();
const optionalDate = z.coerce.date().optional();

// Common Validation Schemas
export const idParamSchema = id;
export const textParamSchema = z.string().trim().min(1);

export const listQuerySchema = z
  .object({
    shop_id: id.optional(),
    company_id: id.optional(),
    user_id: id.optional(),
    status: z.coerce.number().int().optional(),
    from_date: optionalDate,
    to_date: optionalDate,
    limit: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

export const dashboardQuerySchema = listQuerySchema;

// TypeScript Types & Interfaces
export type DashboardListQuery = z.infer<typeof listQuerySchema>;
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
export type DashboardIdParam = z.infer<typeof idParamSchema>;

export interface DashboardResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}
