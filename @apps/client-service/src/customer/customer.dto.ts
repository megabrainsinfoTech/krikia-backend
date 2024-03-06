import { IsNotEmpty } from "class-validator"

export class CreateCustomerDTO {

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    businessId: string;
}

export class UpdateCustomerDTO {
    @IsNotEmpty()
    userId?: string;

    @IsNotEmpty()
    businessId?: string;
}