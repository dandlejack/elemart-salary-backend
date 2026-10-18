import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type EmployeesDocument = Employee & mongoose.Document

@Schema()
export class Employee {
    @Prop()
    employees_id: string;
    @Prop()
    firstname: string;
    @Prop()
    lastname: string
    @Prop()
    fullname: string;
    @Prop()
    current_salary: number;
    @Prop()
    social_security: number;
    // 'active' or 'resigned'; employees created before this field existed count as active.
    @Prop()
    status: string;
    @Prop()
    resigned_date: Date;
    @Prop()
    createdDate: Date;
    @Prop()
    updateDate: Date;
}
export interface EmployeeProps extends mongoose.Document {
    _id: string;
    employees_id: string;
    firstname: string;
    lastname: string
    fullname: string;
    current_salary: number;
    social_security: number;
    status: string;
    resigned_date: Date;
    createdDate: Date;
    updateDate: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)
