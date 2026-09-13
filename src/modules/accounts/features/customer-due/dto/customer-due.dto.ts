import z from 'zod';

export const CustomerDueSchema = z.object({
  id: z.number().int().positive().nullable().optional(),
  shop_id: z.number(),
  customer_id: z.number(),
  ref_type: z.coerce.number().optional(),
  ref_id: z.string().optional(),
  invoice_no: z.string(),
  due_date: z.coerce.date(),
  total_amount: z.coerce.number(),
  paid_amount: z.coerce.number(),
  due_amount: z.coerce.number(),
  payment_status: z.coerce.number().int().optional(),
  remarks: z.string().optional(),
});

export type customerDueType = z.infer<typeof CustomerDueSchema>;
