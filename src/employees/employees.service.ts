import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { generateUserId } from 'src/util/generateUserId';
import { normalizeName } from 'src/util/normalizeName';
import { EmployeeProps } from './employees.model';

@Injectable()
export class EmployeesService {
    constructor(@InjectModel('Employee') private employeesModel: Model<EmployeeProps>) { }
    async findAll(req, res) {
        return 'findall'
    }

    async insertEmployee(data: EmployeeProps) {
        const curDate = new Date(Date.now())
        data.employees_id = generateUserId(19)
        data.firstname = normalizeName(data.firstname)
        data.lastname = normalizeName(data.lastname)
        data.fullname = normalizeName(data.firstname+' '+data.lastname)
        data.status = 'active'
        data.createdDate = curDate
        data.updateDate = curDate
        const createdNewEmployee = new this.employeesModel(data)
        await createdNewEmployee.save()
        const result = {
            success: true,
            data: 'successful'
        }
        return result
    }
    async findAllEmployees() {
        const rawData = await this.employeesModel.find().exec()
        const result = rawData.map(data=>{
            return {
                employee_id:data.employees_id,
                fullname:data.fullname,
                current_salary:data.current_salary,
                social_security:data.social_security,
                status:data.status || 'active',
                resigned_date:data.resigned_date
            }
        })
        return result
    }

    async findEmployeeByEmployeeId(employees_id:string){
        const rawData = await this.employeesModel.findOne({employees_id:employees_id}).exec()
        return rawData
    }

    // Updates only the fields that were sent: salary (with its social security) and/or employment status.
    async updateSalaryByEmployeeId(employee_id,data) {
        const update: any = { updateDate: new Date(Date.now()) }
        if (data.current_salary !== undefined) {
            update.current_salary = data.current_salary
            update.social_security = data.social_security
        }
        if (data.status === 'active' || data.status === 'resigned') {
            update.status = data.status
            update.resigned_date = data.status === 'resigned' ? new Date(data.resigned_date || Date.now()) : null
        }
        const result = await this.employeesModel.updateOne({employees_id:employee_id},update)
        if(result.ok === 1){
            return 'successful'
        }
    }

    async deleteReportByEmployeeId(employee_id: string) {
        return await this.employeesModel.deleteOne({ employees_id: employee_id })
    }
}
