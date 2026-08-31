import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const data = await this.prisma.invoiceMst.findMany({
      where: { status: 1 },
      orderBy: { id: 'desc' },
      take: 20,
    });
    return { success: true, data };
  }

  async recent() {
    const data = await this.prisma.invoiceMst.findMany({
      where: { status: 1 },
      orderBy: { id: 'desc' },
      take: 10,
    });
    return { success: true, data };
  }

  async overview() {
    const data = await this.prisma.invoiceMst.findMany({
      where: { status: 1 },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }

  async stockOverview() {
    const data = await this.prisma.stockMst.findMany({
      where: { status: 1 },
      orderBy: { id: 'desc' },
    });
    return { success: true, data };
  }
}
