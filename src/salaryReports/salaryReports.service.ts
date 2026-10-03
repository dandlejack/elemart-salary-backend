import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { generateUserId } from 'src/util/generateUserId';
import { compareMonthReport, parseMonthReport } from 'src/util/monthReport';
import { normalizeName } from 'src/util/normalizeName';
import { SalaryReportsProps } from './salaryReports.model';

const NUMERIC_FIELDS = ['absent', 'agent', 'agent_tax', 'allowance', 'bonus', 'bonus_tax', 'fuel', 'late', 'lending', 'overtime', 'salary', 'social_security', 'tax', 'fund']

// Query values must be plain strings; express parses `x[$ne]=` into objects.
const queryString = (value: any): string | undefined => typeof value === 'string' && value !== '' ? value : undefined

const toNumber = (value: any): number => {
    if (typeof value === 'number') return value
    if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) return Number(value)
    return 0
}

// `fullname` is expected normalized; stored names may still have extra spaces from before names were normalized.
const matchesEmployee = (row: any, employees_id?: string, fullname?: string) =>
    (employees_id !== undefined && row.employees_id === employees_id) || (fullname !== undefined && normalizeName(row.fullname) === fullname)

// Matches a normalized name regardless of extra spaces in the stored value.
const fullnameRegex = (fullname: string) =>
    new RegExp('^\\s*' + fullname.split(' ').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+') + '\\s*$')

// Drop UI-only fields (the table's delete button), normalize names and store numeric strings as numbers.
const sanitizeAttributes = (attributes: any[]) => (attributes || []).map(row => {
    const { operation, ...rest } = row
    rest.fullname = normalizeName(rest.fullname)
    NUMERIC_FIELDS.forEach(field => {
        const value = rest[field]
        if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) rest[field] = Number(value)
    })
    return rest
})

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

    // Year-to-date totals for one employee, up to and including the selected report.
    async findTotalSecuritySocialAndLate(req, res) {
        const report_id = queryString(req.query.report_id)
        const employees_id = queryString(req.query.employees_id)
        const fullname = normalizeName(queryString(req.query.fullname))
        const result = {
            total_security_social: 0,
            total_late: 0,
            total_absent: 0,
            total_lending: 0,
            total_fund: 0
        }
        if (!report_id || (!employees_id && !fullname)) return result

        const selected = await this.salaryReportsModel.findOne({ report_id: report_id }).exec()
        if (!selected) return result
        const year = parseMonthReport(selected.month_report).year
        const reports = await this.salaryReportsModel.find({ year_of_report: String(year) }).exec()
        reports
            .filter(report => compareMonthReport(report.month_report, selected.month_report) <= 0)
            .forEach(report => report.attributes
                .filter(row => matchesEmployee(row, employees_id, fullname))
                .forEach(row => {
                    result.total_security_social += toNumber(row.social_security)
                    result.total_late += toNumber(row.late)
                    result.total_absent += toNumber(row.absent)
                    result.total_lending += toNumber(row.lending)
                    result.total_fund += toNumber(row.fund)
                }))
        return result
    }

    // All reports in month order, or only those containing the given employee.
    async findSalaryList(req, res) {
        const employees_id = queryString(req.query.employees_id)
        const fullname = normalizeName(queryString(req.query.fullname))
        const or = []
        if (employees_id) or.push({ 'attributes.employees_id': employees_id })
        if (fullname) or.push({ 'attributes.fullname': fullnameRegex(fullname) })
        const rawData = await this.salaryReportsModel.find(or.length > 0 ? { $or: or } : {}, { report_id: 1, month_report: 1 }).exec()
        return rawData
            .map(data => ({
                report_id: data.report_id,
                month_report: data.month_report
            }))
            .sort((a, b) => compareMonthReport(a.month_report, b.month_report))
    }

    async insertReport(data: SalaryReportsProps) {
        const curDate = new Date(Date.now())
        data.report_id = generateUserId(30)
        data.createdDate = curDate
        data.updateDate = curDate
        data.attributes = sanitizeAttributes(data.attributes)

        const createdNewReport = new this.salaryReportsModel(data)
        await createdNewReport.save()
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
        const result = await this.salaryReportsModel.updateOne({ report_id: report_id }, { attributes: sanitizeAttributes(data.attributes), updateDate: curDate })
        if (result.ok === 1) {
            return 'successful'
        }
    }

    async getLateSalary(req, res) {
        var result = {}
        const chartResult = {}
        const label = []
        const chartData = []
        const filterObject = req.query.filterObject && JSON.parse(req.query.filterObject as string) || {};
        result[`attributes.${filterObject.type}`] = -1
        const t = await this.salaryReportsModel.aggregate([
            {
                $match: { month_report: filterObject.month_report }
            },
            {
                $unwind: "$attributes"
            },
            {
                $sort: result
            }
        ])
        t.map(d => {
            label.push(d['attributes'][`fullname`])
            chartData.push(d['attributes'][`${filterObject.type}`])
        })
        chartResult['label'] = label
        chartResult['data'] = chartData
        // console.log(chartData)
        // console.log(JSON.parse(JSON.stringify(rawResult[0].attributes)))
        // console.log(JSON.parse(JSON.stringify(t)))
        return chartResult
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
