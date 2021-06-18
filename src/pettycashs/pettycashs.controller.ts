import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Put } from '@nestjs/common';
import { PettyCashsProps } from './pettycashs.model';
import { PettycashsService } from './pettycashs.service';

@Controller('pettycashs')
export class PettycashsController {
  constructor(private readonly pettycashsService: PettycashsService) {}

  @Get('/findall')
  findAll() {
    return this.pettycashsService.findAll();
  }
  
  @Get('/findlist')
  findList(){
    return this.pettycashsService.findList();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pettycashsService.findOne(id);
  }

  @Post('/addreport')
  insert(@Body() data: any){
    return this.pettycashsService.addPettyCashReport(data)
  }

  @Put(':id')
  update(@Param('id') id:string, @Body() data:any){
    return this.pettycashsService.updateByPettyCashId(id,data)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pettycashsService.remove(id);
  }
}
