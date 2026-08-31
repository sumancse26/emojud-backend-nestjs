import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toDate, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class SalaryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: Record<string, any> = {}) {
    const where: any = {};
    if (query.shop_id) where.shop_id = toBigInt(query.shop_id);
    if (query.salary_month) where.salary_month = toBigInt(query.salary_month);
    if (query.salary_year) where.salary_year = toBigInt(query.salary_year);
    if (query.status !== undefined) where.status = toNumber(query.status);

    const data = await this.prisma.salaryProcessMst.findMany({
      where,
      include: { salaryProcessDtls: true },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async detail(id: string) {
    const data = await this.prisma.salaryProcessMst.findUnique({
      where: { id: BigInt(id) },
      include: { salaryProcessDtls: { include: { employee: true } }, shop: true },
    });
    if (!data) throw new NotFoundException('Salary process not found');
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const details: any[] = Array.isArray(data.details) ? data.details : [];

    const result = await this.prisma.$transaction(async (tx) => {
      const masterPayload: any = {
        process_no: data.process_no || `SAL-${randomUUID().slice(0, 8).toUpperCase()}`,
        shop_id: toBigInt(data.shop_id),
        salary_month: toBigInt(data.salary_month) ?? BigInt(1),
        salary_year: toBigInt(data.salary_year) ?? BigInt(2024),
        process_date: toDate(data.process_date) ?? new Date(),
        total_employee: toBigInt(data.total_employee) ?? BigInt(0),
        total_amount: data.total_amount ? Number(data.total_amount) : 0,
        total_paid_amount: data.total_paid_amount ? Number(data.total_paid_amount) : 0,
        total_due_amount: data.total_due_amount ? Number(data.total_due_amount) : 0,
        remarks: data.remarks,
        status: toNumber(data.status) ?? 1,
      };

      const master = id
        ? await tx.salaryProcessMst.update({
            where: { id },
            data: {
              ...masterPayload,
              updated_at: new Date(),
              updated_by: toBigInt(data.updated_by ?? data.login_user_id),
            },
          })
        : await tx.salaryProcessMst.create({
            data: {
              ...masterPayload,
              created_by: toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
            },
          });

      if (id) {
        await tx.salaryProcessDtl.deleteMany({ where: { salary_process_mst_id: master.id } });
      }

      for (const item of details) {
        await tx.salaryProcessDtl.create({
          data: {
            salary_process_mst_id: master.id,
            employee_id: toBigInt(item.employee_id) ?? BigInt(1),
            basic_salary: item.basic_salary ? Number(item.basic_salary) : 0,
            allowance_amount: item.allowance_amount ? Number(item.allowance_amount) : 0,
            bonus_amount: item.bonus_amount ? Number(item.bonus_amount) : 0,
            overtime_amount: item.overtime_amount ? Number(item.overtime_amount) : 0,
            deduction_amount: item.deduction_amount ? Number(item.deduction_amount) : 0,
            net_salary: item.net_salary ? Number(item.net_salary) : 0,
            paid_amount: item.paid_amount ? Number(item.paid_amount) : 0,
            due_amount: item.due_amount ? Number(item.due_amount) : 0,
            payment_date: toDate(item.payment_date),
            payment_method_id: toBigInt(item.payment_method_id),
            remarks: item.remarks,
          },
        });
      }

      return master;
    });

    return {
      success: true,
      message: id ? 'Salary process updated successfully' : 'Salary process created successfully',
      data: result,
    };
  }
}
