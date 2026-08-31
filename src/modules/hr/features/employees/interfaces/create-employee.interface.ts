import { z } from 'zod';

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

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
