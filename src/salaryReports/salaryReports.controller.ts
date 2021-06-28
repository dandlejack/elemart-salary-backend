import { Body, Controller, Delete, Get, Param, Post, Put, Req,  Res } from '@nestjs/common';
import { SalaryReportsService } from './salaryReports.service';
import { Request, Response } from 'express';

@Controller('reports')
export class SalaryReportsController {
    constructor(private salaryReportService: SalaryReportsService) {

    }
    @Post('/AddReport')
    insert(@Body() data: any) {
        return this.salaryReportService.insertReport(data)
    }

    @Get('/findall')
    async findAll(@Req() req: Request, @Res() res: Response) {
        const result = await this.salaryReportService.findAll(req, res)
        res.send(result)
    }

    @Get('/getLateSalary')
    async getLateSalary(@Req() req: Request, @Res() res: Response) {
        const result = await this.salaryReportService.getLateSalary(req, res)
        res.send(result)
    }

    @Get('/findSalaryList')
    async findSalaryList(@Req() req: Request, @Res() res: Response) {
        const result = await this.salaryReportService.findSalaryList(req, res)
        res.send(result)
    }
    @Get('/findTotalSecuritySocialAndLate')
    async findTotalSecuritySocial(@Req() req: Request, @Res() res: Response) {
        const result = await this.salaryReportService.findTotalSecuritySocialAndLate(req, res)
        res.send(result)
    }
    @Put('/:id')
    async updateReport(@Param('id') id, @Body() data: any) {
        return this.salaryReportService.updateReportByReportID(id, data)
    }
    @Delete(':report_id')
    async deleteReportByReportID(@Param('report_id') report_id: string) {
        return await this.salaryReportService.deleteReportByReportID(report_id)

    }

    // @Get('/:id')
    // async findByEmployeeId(@Param('id') id:string){
    //     return this.employeesService.findEmployeeByEmployeeId(id)
    // }
}
