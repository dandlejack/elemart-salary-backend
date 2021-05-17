import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryReportsController } from './salaryReports.controller';
import { SalaryReportsSchema } from './salaryReports.model';
import { SalaryReportsService } from './salaryReports.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'SalaryReport', schema: SalaryReportsSchema }])],
    providers: [SalaryReportsService],
    controllers: [SalaryReportsController],
    exports: [SalaryReportsService]
})
export class SalaryReportsModule { }
