import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordServiceService } from 'src/modules/auth/password-service/password-service.service';
import { JwtService } from 'src/modules/auth/jwt/jwt.service';
import type { CreateEmployeeInput } from 'src/modules/hr/interfaces/validation.interface';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordServiceService,
    private readonly jwtService: JwtService,
  ) {}

  async list(shopId: number) {
    const rows = await this.prisma.employees.findMany({
      where: {
        shop_id: Number(shopId),
        is_active: 1,
        status: 1,
      },
      select: {
        id: true,
        employee_code: true,
        full_name: true,
        phone: true,
        email: true,
        address: true,
        join_date: true,
        nid: true,
        passport_no: true,
        basic_salary: true,
        department: {
          select: {
            id: true,
            display_code: true,
            department_name: true,
          },
        },
        designation: {
          select: {
            id: true,
            display_code: true,
            designation_name: true,
          },
        },
        shop: {
          select: {
            id: true,
            display_code: true,
            short_code: true,
            shop_name: true,
            image: true,
          },
        },
        genderLookup: {
          select: {
            id: true,
            lookup_code: true,
            lookup_value: true,
          },
        },
        bloodGroupLookup: {
          select: {
            id: true,
            lookup_code: true,
            lookup_value: true,
          },
        },
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

        // Find existing records using the unique employee code and username.
        let employee = input.employee_code
          ? await tx.employees.findUnique({
              where: { employee_code: input.employee_code },
            })
          : null;
        let user = await tx.users.findUnique({
          where: { username: input.username },
        });

        // If the username already belongs to an employee, use that employee
        // when no employee code match was found.
        if (!employee && user?.employee_id) {
          employee = await tx.employees.findUnique({
            where: { id: user.employee_id },
          });
        }

        if (employee && user?.employee_id && user.employee_id !== employee.id) {
          throw new ConflictException(
            'Employee code and username belong to different employees',
          );
        }

        const employeeData = {
          employee_code: input.employee_code ?? employee?.employee_code ?? null,
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
          basic_salary: input.basic_salary ?? null,
          photo_url: input.photo_url,
        };

        // Update the employee when found; otherwise create it.
        employee = employee
          ? await tx.employees.update({
              where: { id: employee.id },
              data: {
                ...employeeData,
                updated_by: createdByBigInt,
                updated_at: new Date(),
              },
            })
          : await tx.employees.create({
              data: {
                ...employeeData,
                created_by: createdByBigInt,
              },
            });

        // If the employee already has a user, update it. Otherwise create one.
        const linkedUser = await tx.users.findFirst({
          where: { employee_id: employee.id },
        });

        if (user && linkedUser && user.id !== linkedUser.id) {
          throw new ConflictException(
            'Username is already used by another employee',
          );
        }

        user = user ?? linkedUser;
        user = user
          ? await tx.users.update({
              where: { id: user.id },
              data: {
                employee_id: employee.id,
                username: input.username,
                password_hash: passwordHash,
                default_role_id: input.default_role_id
                  ? BigInt(input.default_role_id)
                  : null,
                company_id: input.company_id ? BigInt(input.company_id) : null,
                status: 1,
                updated_by: createdByBigInt,
                updated_at: new Date(),
              },
            })
          : await tx.users.create({
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
          role_id: user.default_role_id ? Number(user.default_role_id) : null,
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
        message: 'Saved successfully',
        id: result.employee.id,
        employee_code: result.employee.employee_code,
        tokens: result.tokens,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Failed to create employee: ${(error as Error).message}`,
      );
    }
  }
}
