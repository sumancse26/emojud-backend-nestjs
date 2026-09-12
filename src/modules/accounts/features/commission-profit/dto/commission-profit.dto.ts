import z from 'zod';

export const CommissionProfitSchema = z.object({
  id: z.number().nullable().default(0),
  shop_id: z.number(),
  year_id: z.number(),
  month_id: z.number(),
  invoice_id: z.number().optional(),
  product_id: z.number().optional(),
  qty: z.coerce.number().optional(),
  purchase_rate: z.coerce.number().optional(),
  sales_rate: z.coerce.number().optional(),
  profit_amount: z.coerce.number().optional(),
  commission_percent: z.coerce.number().optional(),
  commission_amount: z.coerce.number(),
  is_received_commission: z.coerce.number().int(),
  received_date: z.coerce.date(),
  dml_date: z.coerce.date().optional(),
  status: z.coerce.number().int().default(1),
});

export type commissionProfitType = z.infer<typeof CommissionProfitSchema>;
