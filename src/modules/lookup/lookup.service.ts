import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LookupService {
  constructor(private readonly prisma: PrismaService) {}
  async commonList(lookupMstIds: number[]) {
    const res = await this.prisma.lookupDtl.findMany({
      where: {
        lookup_mst_id: {
          in: lookupMstIds.map((id) => BigInt(id)),
        },
        is_active: 1,
      },
      include: {
        lookupMst: true,
      },
      orderBy: {
        sort_order: 'asc',
      },
    });

    const groupedData = res.reduce(
      (result, item) => {
        const key = item.lookupMst.lookup_name
          ?.toLocaleLowerCase()
          .replace(/\s+/g, '_');

        if (!key) {
          return result;
        }

        if (!result[key]) {
          result[key] = [];
        }

        result[key].push({
          id: item.id.toString(),
          lookup_code: item.lookup_code,
          lookup_value: item.lookup_value,
        });

        return result;
      },
      {} as Record<string, any[]>,
    );

    return {
      response_code: 200,
      success: true,
      data: groupedData,
    };
  }
}
