import { Module, forwardRef } from '@nestjs/common';
import { ListingService } from './listing.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Listing } from './listing.model';
import { GlobalModule } from '../global/global.module';
import { ListingController } from './listing.controller';
import { SharedWishlistModule } from '../shared-wishlist/shared-wishlist.module';
import { WishlistModule } from '../wishlist/wishlist.module';
import { ListingAmenity } from './listing-amenity.model';
import { ListingFAQ } from './listing-faq.model';
import { ListingLandmark } from './listing-landmark.model';
import { ListingLocation } from './listing-location.model';
import { ListingPlanModule } from '../listing-plan/listing-plan.module';

@Module({
  imports: [SequelizeModule.forFeature([Listing, ListingAmenity, ListingFAQ, ListingLandmark, ListingLocation]), SharedWishlistModule, WishlistModule, ListingPlanModule],
  providers: [ListingService],
  exports: [ListingService],
  controllers: [ListingController]
})
export class ListingModule {}
