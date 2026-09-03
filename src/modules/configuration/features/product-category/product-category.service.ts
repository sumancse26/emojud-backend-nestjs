import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { toBigInt, toNumber } from 'src/common/utils/prisma.util';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async list(companyId: number) {
    const company_id = toBigInt(companyId);

    if (company_id == null) {
      return { success: true, data: [] };
    }

    const data = await this.prisma.productCategory.findMany({
      where: {
        company_id,
        parent_category_id: null,
      },
      select: {
        id: true,
        category_name: true,
      },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async subCategoryList(parentCategoryId: number, companyId: number) {
    const parent_category_id = toBigInt(parentCategoryId);
    const company_id = toBigInt(companyId);

    if (parent_category_id == null || company_id == null) {
      return { success: true, data: [] };
    }

    const data = await this.prisma.productCategory.findMany({
      where: {
        company_id,
        parent_category_id,
      },
      select: {
        id: true,
        category_name: true,
      },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async save(data: Record<string, any>) {
    const id = toBigInt(data.id);
    const payload: any = {
      category_name: data.category_name,
      parent_category_id: toBigInt(data.parent_category_id),
      company_id: toBigInt(data.company_id),
      status: toNumber(data.status) ?? 1,
    };

    if (id) {
      const updated = await this.prisma.productCategory.update({
        where: { id },
        data: {
          ...payload,
          updated_at: new Date(),
          updated_by: toBigInt(data.updated_by ?? data.login_user_id),
        },
      });
      return {
        success: true,
        message: 'Category updated successfully',
        data: updated,
      };
    }

    const created = await this.prisma.productCategory.create({
      data: {
        ...payload,
        created_by:
          toBigInt(data.created_by ?? data.login_user_id) ?? BigInt(1),
      },
    });
    return {
      success: true,
      message: 'Category created successfully',
      data: created,
    };
  }
}
