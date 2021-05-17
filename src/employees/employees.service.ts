import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { generateUserId } from 'src/util/generateUserId';
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
        data.fullname = data.firstname+' '+data.lastname
        data.createdDate = curDate
        data.updateDate = curDate
        const createdNewEmployee = new this.employeesModel(data)
        createdNewEmployee.save()
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
                social_security:data.social_security
            }
        })
        return result
    }

    async findEmployeeByEmployeeId(employees_id:string){
        const rawData = await this.employeesModel.findOne({employees_id:employees_id}).exec()
        return rawData
    }

    async updateSalaryByEmployeeId(employee_id,data) {
        const result = await this.employeesModel.updateOne({employees_id:employee_id},{current_salary:data.current_salary,social_security:data.social_security})
        if(result.ok === 1){
            return 'successful'
        }
    }
}
