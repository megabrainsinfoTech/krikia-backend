import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SharedWishlist } from './shared-wishlist.model';
import { CreateSharedWishlistDTO, UpdateSharedWishlistDTO } from './shared-wishlist.dto';

@Injectable()
export class SharedWishlistService {

    constructor(@InjectModel(SharedWishlist) private readonly sharedWishlist: typeof SharedWishlist){}

    async create(createBody: CreateSharedWishlistDTO){
        const sharedWishlist = this.sharedWishlist.build({...(createBody as any)});
        await sharedWishlist.save();
        return `${process.env.KRIKIA_URL}/wishlist/share/${sharedWishlist.id}`;
    }

    async findById(id: string){
        return await this.sharedWishlist.findByPk(id);
    }

    async update(id: string, updateBody: UpdateSharedWishlistDTO){
        await this.sharedWishlist.update(updateBody, { where: { id } });
    }

    async delete(id: string){
        await this.sharedWishlist.destroy({ where: { id } });
    }

}
