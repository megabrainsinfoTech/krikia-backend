import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ListingService } from './listing.service';

@Controller('listing')
export class ListingController {

    constructor(private readonly listingService: ListingService){}

    @Get()
    async getAllListing(@Req() req: any){
        return await this.listingService.findAll(req.user?.id);
    }

    @Get("share/:shareUrl") 
    async getSharedWishlist(@Param("shareUrl") shareUrl: string){
        return await this.listingService.findAllSharedByUrl(shareUrl);
    };

    @Get(":slug")
    async getSingleListing(@Param("slug") slug: string, @Req() req: any){
        return await this.listingService.findBySlugWithNested(slug, req.user?.id);
    }

    @Get(":slug/inspection-schedule")
    getSingleListingSiteInspectionSchedule(@Param("slug") slug: string ){
        return this.listingService.findBySlugWithSiteInspection(slug);
    }


    @Get(":slug/business-details")
    getSingleListingBusinessDetails(@Param("slug") slug: string ){
        return this.listingService.findBySlugWithBusinessDetails(slug);
    }

    @Get(":slug/rating-review-details")
    getSingleListingRatingReviewDetails(@Param("slug") slug: string ){
        return this.listingService.findBySlugWithRatingsReviewDetails(slug);
    }

    @Get(":slug/reviews")
    getSingleListingReviews(@Param("slug") slug: string ){
        return this.listingService.findBySlugWithReviews(slug);
    }

    @Get(":slug/payment-information")
    getSingleListingPaymentInformation(@Param("slug") slug: string, @Query() query:any ){
        return this.listingService.findBySlugWithPaymentInformation(slug, query);
    }

}
