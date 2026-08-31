import { z } from 'zod';
const id = z.coerce.number().int().positive();
export const listQuerySchema = z.object({ id: id.optional(), shop_id: id.optional(), warehouse_id: id.optional(), supplier_id: id.optional(), prod_id: id.optional(), status: z.coerce.number().int().optional() }).passthrough();
export const saveBodySchema = z.object({ id: id.optional(), shop_id: id.optional(), warehouse_id: id.optional(), supplier_id: id.optional(), login_user_id: id.optional(), status: z.coerce.number().int().optional(), details: z.array(z.record(z.string(), z.unknown())).optional(), products: z.array(z.record(z.string(), z.unknown())).optional() }).passthrough();
export const idParamSchema = id;
export type StockListQuery = z.infer<typeof listQuerySchema>;
export type StockSaveBody = z.infer<typeof saveBodySchema>;
