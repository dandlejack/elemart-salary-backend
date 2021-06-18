import { Module } from '@nestjs/common';
import { PettycashsService } from './pettycashs.service';
import { PettycashsController } from './pettycashs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PettyCashsSchema } from './pettycashs.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'pettycashs', schema: PettyCashsSchema }])],
  controllers: [PettycashsController],
  providers: [PettycashsService]
})
export class PettycashsModule {}
