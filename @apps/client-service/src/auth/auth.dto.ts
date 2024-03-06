import { IsEmail, IsNotEmpty, MinLength, MaxLength, IsOptional, IsString } from "class-validator"

export class LoginAuthDTO {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(12)
    password: string;

    @IsOptional()
    @IsString()
    firstName: string;

    @IsOptional()
    @IsString()
    lastName: string;

}



