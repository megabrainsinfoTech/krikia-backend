import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Wishlist } from './wishlist.model';
import { CreateWishlistDTO } from './wishlist.dto';
import { SharedWishlist } from '../shared-wishlist/shared-wishlist.model';
import { User } from '../user/user.model';
@Injectable()
export class WishlistService {

    constructor(
        @InjectModel(Wishlist) private readonly wishlist: typeof Wishlist,
    ){}

    async create(userId: string, createWishlistBody: CreateWishlistDTO){
        return await this.wishlist.create({userId, ...createWishlistBody} as any);
    }

    async delete(wishlistItemId: string, userId: string){
        return await this.wishlist.destroy({ where: { id: wishlistItemId, userId } });
    }

    async findByUserId(userId: string){
        return await this.wishlist.findOne({ where: { userId } });
    }

    async findUserBySharedWishlistId(sharedWishlistId: string){
        const wishlist = await this.wishlist.findOne({
            include: [
                {
                    model: SharedWishlist,
                    where: { id: sharedWishlistId },
                    attributes: []
                },
                {   
                    model: User,
                    attributes: ["email", "firstName", "lastName", "fullName"]
                }
            ]
        })

        return (wishlist as any)?.user;
    }

    async findAll(userId: string){
        return await this.wishlist.findAll({ where: { userId } });
    }
}
