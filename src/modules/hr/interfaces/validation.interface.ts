import { z } from 'zod';

const id = z.coerce.number().int().positive();

// Common Validation Schemas
export const idParamSchema = id;
export const textParamSchema = z.string().trim().min(1);

export const listQuerySchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    user_id: id.optional(),
    role_id: id.optional(),
    department_id: id.optional(),
    designation_id: id.optional(),
    shop_id: id.optional(),
    department_name: z.string().optional(),
    designation_name: z.string().optional(),
    role_name: z.string().optional(),
    status: z.coerce.number().int().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  })
  .passthrough();

export const saveBodySchema = z
  .object({
    id: id.optional(),
    company_id: id.optional(),
    user_id: id.optional(),
    role_id: id.optional(),
    department_id: id.optional(),
    designation_id: id.optional(),
    shop_id: id.optional(),
    department_name: z.string().optional(),
    designation_name: z.string().optional(),
    role_name: z.string().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
    status: z.coerce.number().int().optional(),
    details: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

export const createEmployeeSchema = z.object({
  // Employee Details
  employee_code: z.string().optional(),
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  join_date: z.string().optional(),
  department_id: z.union([z.number(), z.string()]).optional(),
  designation_id: z.union([z.number(), z.string()]).optional(),
  gender: z.union([z.number(), z.string()]).optional(),
  blood_group: z.union([z.number(), z.string()]).optional(),
  nid: z.string().optional(),
  passport_no: z.string().optional(),
  emp_photo: z.union([z.number(), z.string()]).optional(),
  nid_photo: z.union([z.number(), z.string()]).optional(),
  shop_id: z.union([z.number(), z.string()]).optional(),
  basic_salary: z.union([z.number(), z.string()]).optional(),
  photo_url: z.string().optional(),
  created_by: z.union([z.number(), z.string()]).optional(),

  // User Account Details (for creating user record)
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  default_role_id: z.union([z.number(), z.string()]).optional(),
  company_id: z.union([z.number(), z.string()]).optional(),

  // Session Metadata
  user_id: z.union([z.number(), z.string()]).optional(),
  device_ip: z.string().optional(),
  device_mac: z.string().optional(),
});

// TypeScript Types & Interfaces
export type HrListQuery = z.infer<typeof listQuerySchema>;
export type HrSaveBody = z.infer<typeof saveBodySchema>;
export type HrIdParam = z.infer<typeof idParamSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export interface DepartmentInput {
  id?: number | string | bigint;
  department_name: string;
  company_id?: number | string | bigint;
  status?: number;
}

export interface DesignationInput {
  id?: number | string | bigint;
  designation_name: string;
  company_id?: number | string | bigint;
  status?: number;
}

export interface RoleInput {
  id?: number | string | bigint;
  role_name: string;
  company_id?: number | string | bigint;
  status?: number;
}

export interface UserRoleInput {
  id?: number | string | bigint;
  user_id: number | string | bigint;
  role_id: number | string | bigint;
}
