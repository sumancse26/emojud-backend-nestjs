import { z } from 'zod';

const id = z.coerce.number().int().positive();

// Common Validation Schemas
export const idParamSchema = id;
export const textParamSchema = z.string().trim().min(1);

export const listQuerySchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    shop_id: id.optional(),
    user_id: id.optional(),
    parent_category_id: id.optional(),
    category_name: z.string().optional(),
    warehouse_name: z.string().optional(),
    shop_name: z.string().optional(),
    status: z.coerce.number().int().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

export const saveBodySchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    shop_id: id.optional(),
    user_id: id.optional(),
    parent_category_id: id.optional(),
    category_name: z.string().optional(),
    warehouse_name: z.string().optional(),
    shop_name: z.string().optional(),
    display_code: z.string().optional(),
    short_code: z.string().optional(),
    address: z.string().optional(),
    address_2: z.string().optional(),
    phone: z.string().optional(),
    image: id.optional(),
    slogan: z.string().optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
    data: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

export const batchSaveBodySchema = z.object({
  data: z.array(
    z
      .object({
        id: id.optional(),
        user_id: id.optional(),
        shop_id: id.optional(),
        company_id: id.optional(),
        status: z.coerce.number().int().optional(),
        login_user_id: id.optional(),
      })
      .passthrough(),
  ),
});

// TypeScript Types & Interfaces
export type ConfigurationListQuery = z.infer<typeof listQuerySchema>;
export type ConfigurationSaveBody = z.infer<typeof saveBodySchema>;
export type ConfigurationBatchSaveBody = z.infer<typeof batchSaveBodySchema>;
export type ConfigurationIdParam = z.infer<typeof idParamSchema>;

export interface ProductCategoryInput {
  id?: number | string | bigint;
  category_name: string;
  parent_category_id?: number | string | bigint;
  company_id?: number | string | bigint;
  status?: number;
}

export interface ShopInput {
  id?: number | string | bigint;
  company_id?: number | string | bigint;
  display_code?: string;
  short_code?: string;
  shop_name: string;
  address?: string;
  address_2?: string;
  phone?: string;
  image?: number | string | bigint;
  slogan?: string;
  status?: number;
}

export interface WarehouseInput {
  id?: number | string | bigint;
  company_id?: number | string | bigint;
  shop_id?: number | string | bigint;
  warehouse_name: string;
  address?: string;
  phone?: string;
  status?: number;
}

export interface UserShopPermissionItem {
  id?: number | string | bigint;
  user_id: number | string | bigint;
  shop_id: number | string | bigint;
  company_id?: number | string | bigint;
}
