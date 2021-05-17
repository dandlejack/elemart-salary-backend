import { Body, Controller, Delete,  Get, Param, Post, Put, Req, Res  } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Request, Response } from 'express';

@Controller('employees')
export class EmployeesController {
    constructor(private employeesService: EmployeesService) {

    }
    @Post('/addEmployee')
    insert(@Body() data:any){
        return this.employeesService.insertEmployee(data)
    }

    @Get('/findall')
    async findAll(@Req() req: Request, @Res() res: Response) {
        const result = await this.employeesService.findAllEmployees()
        res.send(result)
    }
    @Get('/:id')
    async findByEmployeeId(@Param('id') id:string){
        return this.employeesService.findEmployeeByEmployeeId(id)
    }
    @Put('/:id')
    async updateEmployeeSalary(@Param('id')id ,@Body() data:any){
        return this.employeesService.updateSalaryByEmployeeId(id,data)
    }
}
