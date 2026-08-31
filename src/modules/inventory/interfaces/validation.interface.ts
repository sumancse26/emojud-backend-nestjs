import { z } from 'zod';
const id = z.coerce.number().int().positive();
export const listQuerySchema = z.object({ id: id.optional(), shop_id: id.optional(), customer_id: id.optional(), supplier_id: id.optional(), status: z.coerce.number().int().optional(), phone: z.string().optional() }).passthrough();
export const saveBodySchema = z.object({ id: id.optional(), shop_id: id.optional(), customer_id: id.optional(), supplier_id: id.optional(), login_user_id: id.optional(), status: z.coerce.number().int().optional(), products: z.array(z.record(z.string(), z.unknown())).optional() }).passthrough();
export const idParamSchema = id;
export const textParamSchema = z.string().trim().min(1);
export type InventoryListQuery = z.infer<typeof listQuerySchema>;
export type InventorySaveBody = z.infer<typeof saveBodySchema>;
