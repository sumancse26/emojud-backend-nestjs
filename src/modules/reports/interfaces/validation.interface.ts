import { z } from 'zod';
const id = z.coerce.number().int().positive();
export const listQuerySchema = z.object({ product_id: id.optional(), from_date: z.coerce.date().optional(), to_date: z.coerce.date().optional(), status: z.coerce.number().int().optional() }).passthrough();
export type ReportQuery = z.infer<typeof listQuerySchema>;
