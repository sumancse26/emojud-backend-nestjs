import z from 'zod';

const queryPositiveInt = z.preprocess(
  (value) => {
    if (typeof value !== 'string') return value;

    const normalized = value.trim();
    return /^\d+$/.test(normalized) ? Number(normalized) : value;
  },
  z.number().int().positive(),
);

export const StockQuerySchema = z.object({
  shop_id: queryPositiveInt,
});
export type stockQueryType = z.infer<typeof StockQuerySchema>;

export const StockDetailsSchema = z.object({
  prod_id: queryPositiveInt,
  shop_id: queryPositiveInt,
});

export type stockDetailsType = z.infer<typeof StockDetailsSchema>;
