import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

export type PettyCashModelsDocument = PettyCash & mongoose.Document

interface AttributesProps {
    date:number;
    description:string;
    received_cash:number;
    received_bank:number;
    paid_cash:number;
    paid_bank:number;
    pettycash_total:number;
}

@Schema()
export class PettyCash {
    @Prop()
    pettycash_id: string;
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
export interface PettyCashsProps extends mongoose.Document {
    _id: string;
    pettycash_id: string;
    year_of_report:string;
    month_report: string;
    attributes: Array<AttributesProps>;
    createdDate: Date;
    updateDate: Date;
}

export const PettyCashsSchema = SchemaFactory.createForClass(PettyCash)
