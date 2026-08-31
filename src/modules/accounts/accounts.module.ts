import { Module } from '@nestjs/common';
import { ExpensesModule } from './features/expenses/expenses.module';
import { SalaryModule } from './features/salary/salary.module';
import { SupplierPaymentModule } from './features/supplier-payment/supplier-payment.module';
import { CustomerDueModule } from './features/customer-due/customer-due.module';
import { CommissionProfitModule } from './features/commission-profit/commission-profit.module';

@Module({
  imports: [
    ExpensesModule,
    SalaryModule,
    SupplierPaymentModule,
    CustomerDueModule,
    CommissionProfitModule,
  ],
  exports: [
    ExpensesModule,
    SalaryModule,
    SupplierPaymentModule,
    CustomerDueModule,
    CommissionProfitModule,
  ],
})
export class AccountsModule {}
