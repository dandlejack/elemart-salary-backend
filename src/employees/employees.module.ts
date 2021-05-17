import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesController } from './employees.controller';
import { EmployeeSchema } from './employees.model';
import { EmployeesService } from './employees.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }])],
    providers: [EmployeesService],
    controllers: [EmployeesController],
    exports: [EmployeesService]
})
export class EmployeesModule { }
