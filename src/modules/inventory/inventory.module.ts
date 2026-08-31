import { Module } from '@nestjs/common';
import { SuppliersModule } from './features/suppliers/suppliers.module';
import { CustomersModule } from './features/customers/customers.module';
import { InvoicesModule } from './features/invoices/invoices.module';

@Module({
  imports: [SuppliersModule, CustomersModule, InvoicesModule],
  exports: [SuppliersModule, CustomersModule, InvoicesModule],
})
export class InventoryModule {}
