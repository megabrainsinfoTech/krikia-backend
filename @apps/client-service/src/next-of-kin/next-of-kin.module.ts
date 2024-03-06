import { Module } from '@nestjs/common';
import { NextOfKinService } from './next-of-kin.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { NextOfKin } from './next-of-kin.model';

@Module({
    imports: [SequelizeModule.forFeature([NextOfKin])],
    providers: [NextOfKinService],
    exports: [NextOfKinService]
})
export class NextOfKinModule {}
