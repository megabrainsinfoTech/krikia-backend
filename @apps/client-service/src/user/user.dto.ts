import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches, IsOptional, IsEnum, IsDate, IsString, IsNumber } from "class-validator"

export class CreateUserDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(12)
    password: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(12)
    // @Matches("password")
    confirmPassword: string;
}

export class PayForListingDTO {

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsNumber()
    totalAmount: number;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum({"Weekly": "Weekly", "Monthly": "Monthly"})
    paymentFrequency: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    listingPlanOptionId: string;

    @IsString()
    fnxReceiverAddress: string;

    @IsOptional()
    @IsString()
    purchaseId?: string;
}

export class UpdateUserDTO {

    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsDate()
    dateOfBirth: Date;

    @IsOptional()
    @IsEnum({"Male": "Male", "Female": "Female"})
    gender: string;

    @IsOptional()
    phone: string;

    @IsOptional()
    stateOfResidence: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    address: string;

}