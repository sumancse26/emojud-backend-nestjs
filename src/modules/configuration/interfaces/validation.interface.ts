import { z } from 'zod';

const id = z.preprocess((val) => {
  if (
    val === '' ||
    val === null ||
    val === undefined ||
    val === 0 ||
    val === '0'
  ) {
    return undefined;
  }
  return Number(val);
}, z.number().int().positive().optional());

// Common Validation Schemas
export const idParamSchema = z.coerce.number().int().positive();
export const textParamSchema = z.string().trim().min(1);

// ============================================================================
// Feature: Product Category
// ============================================================================
export const saveProductCategorySchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    parent_category_id: id.nullable().optional(),
    category_name: z.string().trim().min(1, 'Category name is required'),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
  })
  .passthrough();

export const productCategorySchema = saveProductCategorySchema;

// ============================================================================
// Feature: Shop
// ============================================================================
export const saveShopSchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    shop_name: z.string().trim().min(1, 'Shop name is required'),
    display_code: z.string().trim().optional(),
    short_code: z.string().trim().optional(),
    address: z.string().optional(),
    address_2: z.string().optional(),
    phone: z.string().optional(),
    image: id.optional(),
    slogan: z.string().optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
  })
  .passthrough();

// ============================================================================
// Feature: Warehouse
// ============================================================================
export const saveWarehouseSchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    shop_id: id.optional(),
    warehouse_name: z.string().trim().min(1, 'Warehouse name is required'),
    address: z.string().optional(),
    phone: z.string().optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
  })
  .passthrough();

// ============================================================================
// Feature: User Shop Permission
// ============================================================================
export const userShopPermissionItemSchema = z
  .object({
    id: id.optional(),
    user_id: id,
    shop_id: id,
    company_id: id.optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
  })
  .passthrough();

export const saveUserShopPermissionSchema = z.object({
  data: z.array(userShopPermissionItemSchema),
});

// Backward-compatible generic schemas
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

export const batchSaveBodySchema = saveUserShopPermissionSchema;

export const listQuerySchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    shop_id: id.optional(),
    user_id: id.optional(),
    status: z.coerce.number().int().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

// ============================================================================
// TypeScript Types & Interfaces
// ============================================================================
export type SaveProductCategoryInput = z.infer<typeof saveProductCategorySchema>;
export type SaveShopInput = z.infer<typeof saveShopSchema>;
export type SaveWarehouseInput = z.infer<typeof saveWarehouseSchema>;
export type UserShopPermissionItemInput = z.infer<typeof userShopPermissionItemSchema>;
export type SaveUserShopPermissionInput = z.infer<typeof saveUserShopPermissionSchema>;

export type ProductCategoryType = SaveProductCategoryInput;
export type ConfigurationSaveBody = z.infer<typeof saveBodySchema>;
export type ConfigurationListQuery = z.infer<typeof listQuerySchema>;
export type ConfigurationIdParam = z.infer<typeof idParamSchema>;

export interface ProductCategoryInput {
  id?: number | string | bigint;
  category_name: string;
  parent_category_id?: number | string | bigint | null;
  company_id?: number | string | bigint;
  status?: number;
}

export interface ShopInput {
  id?: number | string | bigint;
  company_id?: number | string | bigint;
  user_id?: number | string | bigint;
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
  created_by?: number;
}

export interface UserShopPermissionItem {
  id?: number | string | bigint;
  user_id: number | string | bigint;
  shop_id: number | string | bigint;
  company_id?: number | string | bigint;
  status?: number;
}
