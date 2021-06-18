import { Injectable, Body } from '@nestjs/common';
import { InjectModel, raw } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateUserId } from 'src/util/generateUserId';
import { PettyCashsProps } from './pettycashs.model';
@Injectable()
export class PettycashsService {
  constructor(@InjectModel('pettycashs') private pettyCashsModel: Model<PettyCashsProps>) { }

  findAll() {
    return `This action returns all pettycashs`;
  }

  async findList() {
    const rawData = await this.pettyCashsModel.find().exec()
    return rawData
  }

  addPettyCashReport(data) {
    if (data.attributes && data.attributes.length > 0) {
      const curDate = new Date(Date.now())
      data.pettycash_id = generateUserId(30)
      data.createdDate = curDate
      data.updateDate = curDate
      const createdNewReport = new this.pettyCashsModel(data)
      createdNewReport.save()
      const result = {
        success: true,
        data: 'successful'  
      }
      return result
    } else {
      return 'รูปแบบข้อมูลผิดพลาด'
    }

  }

  async findOne(id: string) {
    const rawData = await this.pettyCashsModel.findOne({pettycash_id:id}).exec()

    return rawData
  }

  async updateByPettyCashId(id:string, data:any) {
    const curDate = new Date(Date.now())
    await this.pettyCashsModel.updateOne({pettycash_id:id},{attributes:data,updateDate:curDate})
    return 1
  }

  async remove(id: string) {
    console.log(`This action removes a #${id} pettycash`)
    await this.pettyCashsModel.deleteOne({pettycash_id:id})
    return `This action removes a #${id} pettycash`;
  }
}
