import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './modules/guard/auth/auth.guard';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { HrModule } from './modules/hr/hr.module';
import { ProductsModule } from './modules/products/products.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { StockManagementModule } from './modules/stock-management/stock-management.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DashboardModule,
    ConfigurationModule,
    HrModule,
    ProductsModule,
    InventoryModule,
    StockManagementModule,
    AccountsModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
