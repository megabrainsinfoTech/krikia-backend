import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, NotContains } from "class-validator";


export class CreateBusinessDTO {

    @IsNotEmpty({message: "Provide a business email"})
    @IsEmail({}, {message: "You entered an invalid email"})
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty({message: "Your business alias is important. Don't skip it"})
    @NotContains("@", { message: "Remove @ from your alias" })
    alias: string;
}

export class UpdateBusinessDTO {
    
    @IsOptional()
    @IsString()
    profession: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @NotContains("@",  { message: "Remove @ from your alias" })
    alias: string;

    @IsDate()
    yearEstablished: string;
    aboutUs: string;

    @IsOptional()
    @IsNotEmpty()
    logoURL: string;

    @IsOptional()
    @IsNotEmpty()
    bannerURL: string;

}

export class UpdateBusinessStatusDTO {
    @IsEnum({Active: "Active", Private: "Private"})
    status: string;
}