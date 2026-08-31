import { z } from 'zod';
const id = z.coerce.number().int().positive();
export const listQuerySchema = z.object({ id: id.optional(), shop_id: id.optional(), category_id: id.optional(), sub_category_id: id.optional(), brand_id: id.optional(), status: z.coerce.number().int().optional(), product_code: z.string().optional() }).passthrough();
export const saveBodySchema = z.object({ id: id.optional(), product_name: z.string().min(1), product_code: z.string().optional(), category_id: id.optional(), sub_category_id: id.optional(), brand_id: id.optional(), unit_id: id.optional(), login_user_id: id.optional(), status: z.coerce.number().int().optional() }).passthrough();
export type ProductListQuery = z.infer<typeof listQuerySchema>;
export type ProductInput = z.infer<typeof saveBodySchema>;
