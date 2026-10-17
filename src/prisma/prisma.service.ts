import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn(
        '⚠️ DATABASE_URL is not set in environment variables. Database queries will fail.',
      );
    }
    const adapter = new PrismaPg({ connectionString: connectionString || '' });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      if (process.env.DATABASE_URL) {
        await this.$connect();
        console.log('✅ Connected to database successfully.');
      }
    } catch (err) {
      console.error('❌ Failed to connect to database in onModuleInit:', err);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (err) {
      console.error('❌ Failed to disconnect from database:', err);
    }
  }
}
