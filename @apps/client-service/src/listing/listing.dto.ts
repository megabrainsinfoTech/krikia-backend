import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { ListingCreationAttributes, ListingStatus, ListingType } from "./listing.interface";

class BasicListingInformationLocationDTO {
    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    city: string;
}
export class CreateListingBasicInformationDTO {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    location: BasicListingInformationLocationDTO;
}

export class CreateListingMediaDTO {

    @IsNotEmpty()
    @IsUrl()
    url: string;

    @IsOptional()
    @IsString()
    description: string;
}

export class CreateListingPricingPlanDTO {

    @IsNotEmpty()
    @IsEnum({"House": "House", "Shop": "Shop", "Land": "Land"})
    listingType: string

    @IsArray()
    plans: any;
}

export class CreateListingBindingAgreeDTO {


    @IsBoolean({ always: true,  message: "You can't proceed until you agree to our terms and conditions"})
    iAgreeToTermsAndConditions: boolean;

    @IsBoolean({ always: true,  message: "You can't proceed until you agree to our market policy"})
    iAgreeToMarketPolicy: boolean;
}

export class CreateListingMetaDataDTO {
    @IsArray()
    landmarks: Landmark[];

    @IsArray()
    amenities: Amenity[];

    @IsArray()
    freqAskedQuestions: FAQ[];
}

export class CreateListingDTO implements ListingCreationAttributes {
    address: string | null;
    description: string;
    freqAskedQues: any[];
    landmarks: any[];
    amenities: any[];
    images: any[];
    video: string | null;
    documents: any[] | null;
    id: string;
    name: string | null;
    slug: string;
    title: string | null;
    type: ListingType | null;
    fees?: any[] | undefined;
    houseType: string | null;
    bedrooms: number;
    toilets: number;
    bathrooms: number;
    status: ListingStatus;
    verifiedBy: any[] | null;
    approvedBy: any[] | null;
    approverMessage: any[] | null;
    approvedDate: Date | null;
    state: string | null;
    country: string | null;
    city: string | null;

}

export class UpdateListingDTO {

}
