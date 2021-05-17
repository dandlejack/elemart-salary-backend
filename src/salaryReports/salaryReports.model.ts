import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type SalaryReportsDocument = SalaryReport & mongoose.Document

interface AttributesProps {
    agent: number
    agent_tax: number
    absent:number
    allowance: number
    bonus: number
    bonus_tax: number
    employees_id:string
    fuel: number
    fullname: string
    key: number
    late: number
    lending: number
    no: number
    overtime: number
    salary: number
    social_security: number
    tax: number
}

@Schema()
export class SalaryReport {
    @Prop()
    report_id: string;
    @Prop()
    year_of_report:string;
    @Prop()
    month_report: string;
    @Prop()
    attributes: Array<AttributesProps>;
    @Prop()
    createdDate: Date;
    @Prop()
    updateDate: Date;
}
export interface SalaryReportsProps extends mongoose.Document {
    _id: string;
    report_id: string;
    year_of_report:string;
    month_report: string;
    attributes: Array<AttributesProps>;
    createdDate: Date;
    updateDate: Date;
}

export const SalaryReportsSchema = SchemaFactory.createForClass(SalaryReport)
