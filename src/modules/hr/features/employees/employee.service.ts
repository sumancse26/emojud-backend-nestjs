import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordServiceService } from 'src/modules/auth/password-service/password-service.service';
import { JwtService } from 'src/modules/auth/jwt/jwt.service';
import { CreateEmployeeInput } from './interfaces/create-employee.interface';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordServiceService,
    private readonly jwtService: JwtService,
  ) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = BigInt(query.shop_id);
    if (query.department_id) where.department_id = BigInt(query.department_id);
    if (query.designation_id) where.designation_id = BigInt(query.designation_id);
    if (query.status !== undefined) where.status = Number(query.status);

    const rows = await this.prisma.employees.findMany({
      where,
      include: {
        department: true,
        designation: true,
        shop: true,
      },
      orderBy: { id: 'desc' },
    });
    return { success: true, data: rows };
  }

  async createEmployee(
    input: CreateEmployeeInput,
    deviceMeta?: { ip?: string | null; mac?: string | null },
  ) {
    try {
      // Hash user password using PasswordServiceService
      const passwordHash = await this.passwordService.hash(input.password);

      const result = await this.prisma.$transaction(async (tx) => {
        const createdByBigInt = input.created_by
          ? BigInt(input.created_by)
          : BigInt(1);

        // 1. Create Employee Record
        const employee = await tx.employees.create({
          data: {
            employee_code: input.employee_code,
            full_name: input.full_name,
            phone: input.phone,
            email: input.email || null,
            address: input.address,
            join_date: input.join_date ? new Date(input.join_date) : null,
            department_id: input.department_id
              ? BigInt(input.department_id)
              : null,
            designation_id: input.designation_id
              ? BigInt(input.designation_id)
              : null,
            gender: input.gender ? BigInt(input.gender) : null,
            blood_group: input.blood_group ? BigInt(input.blood_group) : null,
            nid: input.nid,
            passport_no: input.passport_no,
            emp_photo: input.emp_photo ? BigInt(input.emp_photo) : null,
            shop_id: input.shop_id ? BigInt(input.shop_id) : null,
            basic_salary: input.basic_salary ? input.basic_salary : null,
            photo_url: input.photo_url,
            created_by: createdByBigInt,
          },
        });

        // 2. Create User Record linked to Employee
        const user = await tx.users.create({
          data: {
            employee_id: employee.id,
            username: input.username,
            password_hash: passwordHash,
            default_role_id: input.default_role_id
              ? BigInt(input.default_role_id)
              : null,
            company_id: input.company_id ? BigInt(input.company_id) : null,
            status: 1,
            created_by: createdByBigInt,
          },
        });

        // 3. Store Session Record for User (device_ip & device_mac from backend meta or input)
        const sessionId = randomUUID();
        const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours validity

        const session = await tx.admUserSession.create({
          data: {
            session_id: sessionId,
            user_id: user.id,
            device_ip: deviceMeta?.ip ?? input.device_ip ?? null,
            device_mac: deviceMeta?.mac ?? input.device_mac ?? null,
            valid_until: validUntil,
            is_active: 'Y',
            status: 1,
            created_by: createdByBigInt,
          },
        });

        // 4. Generate JWT tokens using JwtService
        const accessToken = await this.jwtService.generateAccessToken({
          user_id: Number(user.id),
          username: user.username,
          company_id: user.company_id ? Number(user.company_id) : null,
          role_id: user.default_role_id
            ? Number(user.default_role_id)
            : null,
        });

        const refreshToken = await this.jwtService.generateRefreshToken(
          Number(user.id),
          sessionId,
          user.company_id ? Number(user.company_id) : null,
          user.default_role_id ? Number(user.default_role_id) : null,
        );

        const { password_hash: _, ...userWithoutPassword } = user;
        return {
          employee,
          user: userWithoutPassword,
          session,
          tokens: { accessToken, refreshToken },
        };
      });

      return {
        success: true,
        message: 'Employee, user, and session created successfully',
        data: result,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create employee: ${(error as Error).message}`,
      );
    }
  }
}
