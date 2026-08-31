import { Module } from '@nestjs/common';
import { EmployeeModule } from './features/employees/employee.module';
import { DepartmentsModule } from './features/departments/departments.module';
import { DesignationsModule } from './features/designations/designations.module';
import { RolesModule } from './features/roles/roles.module';
import { UserRolesModule } from './features/user-roles/user-roles.module';

@Module({
  imports: [
    EmployeeModule,
    DepartmentsModule,
    DesignationsModule,
    RolesModule,
    UserRolesModule,
  ],
  exports: [
    EmployeeModule,
    DepartmentsModule,
    DesignationsModule,
    RolesModule,
    UserRolesModule,
  ],
})
export class HrModule {}
