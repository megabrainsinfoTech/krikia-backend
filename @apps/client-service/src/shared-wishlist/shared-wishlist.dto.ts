import { IsNotEmpty, IsString } from "class-validator";

export class CreateSharedWishlistDTO {

    @IsNotEmpty()
    @IsString()
    wishlistId: string;

    @IsNotEmpty()
    payload: string | string[];
}

export class UpdateSharedWishlistDTO {
    
}