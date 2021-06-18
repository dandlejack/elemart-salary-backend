import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesController } from './employees/employees.controller';
import { EmployeesModule } from './employees/employees.module';
import { SalaryReportsModule } from './salaryReports/salaryReports.module';
import { SalaryReportsController } from './salaryReports/salaryReports.controller';
import { PettycashsModule } from './pettycashs/pettycashs.module';

@Module({
  imports: [EmployeesModule, SalaryReportsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/elemart-salary'),
    PettycashsModule
  ],
  controllers: [AppController, EmployeesController, SalaryReportsController],
  providers: [AppService],
})
export class AppModule { }
