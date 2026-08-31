import { z } from 'zod';
const id = z.coerce.number().int().positive();
export const listQuerySchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    user_id: id.optional(),
    role_id: id.optional(),
    department_id: id.optional(),
    designation_id: id.optional(),
    shop_id: id.optional(),
    status: z.coerce.number().int().optional(),
  })
  .passthrough();
export const saveBodySchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    user_id: id.optional(),
    role_id: id.optional(),
    department_id: id.optional(),
    designation_id: id.optional(),
    shop_id: id.optional(),
    login_user_id: id.optional(),
    status: z.coerce.number().int().optional(),
    details: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();
export const idParamSchema = id;
export type HrListQuery = z.infer<typeof listQuerySchema>;
export type HrSaveBody = z.infer<typeof saveBodySchema>;
