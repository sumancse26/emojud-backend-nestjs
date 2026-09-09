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
// Feature: Department
// ============================================================================
export const saveDepartmentSchema = z
  .object({
    id: id.optional(),
    department_name: z.string().trim().min(1, 'Department name is required'),
    display_code: z.string().trim().optional(),
    status: z.coerce.number().int().optional(),
  })
  .passthrough();

export const departmentSchema = saveDepartmentSchema;

// ============================================================================
// Feature: Designation
// ============================================================================
export const saveDesignationSchema = z
  .object({
    id: id.optional(),
    designation_name: z.string().trim().min(1, 'Designation name is required'),
    display_code: z.string().trim().optional(),
    company_id: id.optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
  })
  .passthrough();

export const designationSchema = saveDesignationSchema;

// ============================================================================
// Feature: Role
// ============================================================================
export const saveRoleSchema = z
  .object({
    id: id.optional(),
    role_name: z.string().trim().min(1, 'Role name is required'),
    short_code: z.string().trim().optional(),
    company_id: id.optional(),
    status: z.coerce.number().int().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
  })
  .passthrough();

export const roleSchema = saveRoleSchema;

// ============================================================================
// Feature: User Role
// ============================================================================
export const saveUserRoleSchema = z
  .object({
    id: id.optional(),
    user_id: id,
    role_id: id,
    company_id: id.optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
  })
  .passthrough();

export const userRoleSchema = saveUserRoleSchema;

// ============================================================================
// Feature: Employee
// ============================================================================
export const createEmployeeSchema = z
  .object({
    // Employee Details
    id: id.optional(),
    employee_code: z.string().optional(),
    full_name: z.string().trim().min(1, 'Full name is required'),
    phone: z.string().optional(),
    email: z
      .string()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    address: z.string().optional(),
    join_date: z.string().optional(),
    department_id: id.optional(),
    designation_id: id.optional(),
    gender: id.optional(),
    blood_group: id.optional(),
    nid: z.string().optional(),
    passport_no: z.string().optional(),
    emp_photo: id.optional(),
    nid_photo: id.optional(),
    shop_id: id.optional(),
    basic_salary: z.coerce.number().optional(),
    photo_url: z.string().optional(),
    created_by: id.optional(),

    // User Account Details
    username: z
      .string()
      .trim()
      .min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    default_role_id: id.optional(),
    company_id: id.optional(),

    // Session Metadata
    user_id: id.optional(),
    device_ip: z.string().optional(),
    device_mac: z.string().optional(),
  })
  .passthrough();

export const saveEmployeeSchema = createEmployeeSchema;

// Backward-compatible generic schemas
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
    display_code: z.string().optional(),
    short_code: z.string().optional(),
    login_user_id: id.optional(),
    created_by: id.optional(),
    updated_by: id.optional(),
    status: z.coerce.number().int().optional(),
    details: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

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

// ============================================================================
// TypeScript Types & Interfaces
// ============================================================================
export type SaveDepartmentInput = z.infer<typeof saveDepartmentSchema>;
export type SaveDesignationInput = z.infer<typeof saveDesignationSchema>;
export type SaveRoleInput = z.infer<typeof saveRoleSchema>;
export type SaveUserRoleInput = z.infer<typeof saveUserRoleSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type SaveEmployeeInput = CreateEmployeeInput;

export type HrListQuery = z.infer<typeof listQuerySchema>;
export type HrSaveBody = z.infer<typeof saveBodySchema>;
export type HrIdParam = z.infer<typeof idParamSchema>;

export interface DepartmentInput {
  id?: number | string | bigint;
  department_name: string;
  display_code?: string;
  company_id?: number | string | bigint;
  status?: number;
}

export interface DesignationInput {
  id?: number | string | bigint;
  designation_name: string;
  display_code?: string;
  company_id?: number | string | bigint;
  status?: number;
}

export interface RoleInput {
  id?: number | string | bigint;
  role_name: string;
  short_code?: string;
  company_id?: number | string | bigint;
  status?: number;
}

export interface UserRoleInput {
  id?: number | string | bigint;
  user_id: number | string | bigint;
  role_id: number | string | bigint;
  company_id?: number | string | bigint;
}

export interface EmployeeInput {
  id?: number | string | bigint;
  employee_code?: string;
  full_name: string;
  phone?: string;
  email?: string;
  address?: string;
  join_date?: Date | string;
  department_id?: number | string | bigint;
  designation_id?: number | string | bigint;
  gender?: number | string | bigint;
  blood_group?: number | string | bigint;
  nid?: string;
  passport_no?: string;
  emp_photo?: number | string | bigint;
  nid_photo?: number | string | bigint;
  shop_id?: number | string | bigint;
  basic_salary?: number;
  status?: number;
}
