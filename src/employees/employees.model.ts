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
    createdDate: Date;
    updateDate: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee)
