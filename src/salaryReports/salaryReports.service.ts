import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { EmployeeProps } from 'src/employees/employees.model';
import { generateUserId } from 'src/util/generateUserId';
import { SalaryReportsProps } from './salaryReports.model';
interface ISaralyList {
    report_id: string;
    month_report: string;
}
@Injectable()
export class SalaryReportsService {
    constructor(@InjectModel('SalaryReport') private salaryReportsModel: Model<SalaryReportsProps>) { }
    async findAll(req, res) {
        const params = req.query
        const filterObject = req.query.filterObject && JSON.parse(req.query.filterObject as string) || {};
        const getAttributes = req.query.getAttributes && JSON.parse(req.query.getAttributes as string) || {};
        // const result = await this.salaryReportsModel.find({"attributes.fullname":'นายเทพไชย วราวุฒิ'},{_id:0,'attributes.$':1}).exec()
        const result = await this.salaryReportsModel.find(filterObject, getAttributes).exec()
        return result
    }

    async findTotalSecuritySocialAndLate(req, res) {
        const params = JSON.parse(req.query.filterObject)
        const filterObject = req.query.filterObject && JSON.parse(req.query.filterObject as string) || {};
        let sum_security_social = 0
        let sum_late = 0
        let sum_absent = 0
        let sum_lending = 0
        const rawData = await this.salaryReportsModel.aggregate([{ $match: filterObject }])
        // console.log(rawData)
        if (rawData.length > 0) {
            rawData.map(data => {
                data.attributes.map(d => {
                    if (d.fullname === params['attributes.fullname']) {
                        sum_security_social += d.social_security
                        sum_late += d.late
                        sum_absent += d.absent
                        sum_lending += d.lending
                    }
                })
            })
            const result = {
                fullname: rawData[0].attributes[0].fullname,
                total_security_social: sum_security_social,
                total_late: sum_late,
                total_absent: sum_absent,
                total_lending: sum_lending
            }
            return result
        } else {
            return `don't have data`
        }

    }

    async findSalaryList(req, res) {
        const sort = {
            month_report: 1
        }
        const rawData = await this.salaryReportsModel.find().sort(sort).exec()
        const result = rawData.map(data => {
            return {
                report_id: data.report_id,
                month_report: data.month_report
            }
        })
        return result
    }

    async insertReport(data: SalaryReportsProps) {
        const curDate = new Date(Date.now())
        data.report_id = generateUserId(30)
        data.createdDate = curDate
        data.updateDate = curDate

        const createdNewReport = new this.salaryReportsModel(data)
        createdNewReport.save()
        const result = {
            success: true,
            data: 'successful'
        }
        return result
    }

    async deleteReportByReportID(report_id: string) {
        return await this.salaryReportsModel.deleteOne({ report_id: report_id })
    }

    async updateReportByReportID(report_id, data) {
        const curDate = new Date(Date.now())
        const result = await this.salaryReportsModel.updateOne({ report_id: report_id }, { attributes: data.attributes, updateDate: curDate })
        if (result.ok === 1) {
            return 'successful'
        }
    }
    // async findAllEmployees() {
    //     const rawData = await this.employeesModel.find().exec()
    //     const result = rawData.map(data=>{
    //         return {
    //             employee_id:data.employees_id,
    //             fullname:data.fullname,
    //             current_salary:data.current_salary,
    //             social_security:data.social_security
    //         }
    //     })        
    //     return result
    // }

}
