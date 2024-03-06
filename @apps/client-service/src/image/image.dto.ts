import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateImageDTO {

    @IsString()
    labelId: string;

    @IsOptional()
    description: string;

    @IsNotEmpty()
    @IsString()
    url: string;
}

export class CreateListingImageDTO {

    @IsNotEmpty()
    @IsString()
    listingId: string;

    images: CreateImageDTO[];
}

export class CreateBusinessImageDTO {
    images: CreateImageDTO[];
}

export class CreateImageLabelDTO {


    @IsString()
    businessId: string;

    @IsNotEmpty()
    @IsString()
    label: string;
}