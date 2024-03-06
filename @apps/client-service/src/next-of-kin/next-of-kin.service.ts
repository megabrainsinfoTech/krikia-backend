import { Body, Injectable } from '@nestjs/common';
import { CreateNextOfKinDTO, UpdateNextOfKinDTO } from './next-of-kin.dto';

@Injectable()
export class NextOfKinService {

    constructor(){}

    create(@Body() createBody: CreateNextOfKinDTO){
        
    }

    findByUserId(userId: string){

    }

    update(userId: string, updateBody: UpdateNextOfKinDTO){
        return { message: "Next of kin updated successfully" };
    }

    delete(userId: string){
        return { message: "Next of kin deleted successfully" };
    }

}
