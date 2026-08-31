import { z } from 'zod';
const id = z.coerce.number().int().positive();
export const listQuerySchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    shop_id: id.optional(),
    user_id: id.optional(),
    status: z.coerce.number().int().optional(),
  })
  .passthrough();
export const saveBodySchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    shop_id: id.optional(),
    user_id: id.optional(),
    login_user_id: id.optional(),
    status: z.coerce.number().int().optional(),
  })
  .passthrough();
export const idParamSchema = id;
export type ConfigurationListQuery = z.infer<typeof listQuerySchema>;
export type ConfigurationSaveBody = z.infer<typeof saveBodySchema>;
