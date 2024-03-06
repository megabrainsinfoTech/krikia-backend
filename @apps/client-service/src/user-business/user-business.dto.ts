import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserBusinessDTO {

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    businessId: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}