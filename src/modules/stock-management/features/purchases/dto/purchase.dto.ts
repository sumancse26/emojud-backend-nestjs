import z from 'zod';

export const PurchaseSchema = z.object({
  id: z.int().nullable().optional(),
  shop_id: z.int(),
  warehouse_id: z.int(),
  supplier_id: z.int(),
  purchase_date: z.coerce.date(),
  challan_no: z.string(),
  challan_date: z.coerce.date(),
  total_amount: z.coerce.number(),
  paid_amount: z.coerce.number(),
  due_amount: z.coerce.number().optional(),
  discount_amount: z.coerce.number().optional(),
  vat_amount: z.coerce.number().optional(),
  net_amount: z.coerce.number().optional(),
  remarks: z.string().optional(),
  is_submit: z.int().optional(),
  is_confirm: z.int().optional(),
  status: z.coerce.number().int().optional(),
  products: z.array(z.record(z.string(), z.unknown())).optional(),
});

export type purchaseType = z.infer<typeof PurchaseSchema>;

export const PurchaseQuerySchema = z.object({
  id: z.coerce.number().int().positive(),
  shop_id: z.coerce.number().int().positive(),
});

export type PurchaseQueryType = z.infer<typeof PurchaseQuerySchema>;

export const PurchaseIdSchema = z.coerce.number().int().positive();

export type PurchaseIdType = z.infer<typeof PurchaseIdSchema>;
