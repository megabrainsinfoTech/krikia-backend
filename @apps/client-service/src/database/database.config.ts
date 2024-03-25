import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';
import { Business } from '../business/business.model';
import { Customer } from '../customer/customer.model';
import { ListingPlanOption } from '../listing-plan-option/listing-plan-option.model';
import { ListingPlan } from '../listing-plan/listing-plan.model';
import { Listing } from '../listing/listing.model';
import { Purchase } from '../purchase/purchase.model';
import { ReviewReply } from '../review-reply/review-reply.model';
import { Review } from '../review/review.model';
import { User } from '../user/user.model';
import { SiteInspection } from '../site-inspection/site-inspection.model';
import { NextOfKin } from '../next-of-kin/next-of-kin.model';
import { Wishlist } from '../wishlist/wishlist.model';
import { UserBusiness } from '../user-business/user-business.model';
import { SharedWishlist } from '../shared-wishlist/shared-wishlist.model';
import { Sequelize } from 'sequelize-typescript';
import { ImageLabel } from '../image/image-label.model';
import { Image } from '../image/image.model';
import { ListingImage } from '../image/listing-image-model';
import { BusinessImage } from '../image/business-image.model';
import { PromoCode } from '../promo-code/promo-code.model';
import { ListingLandmark } from '../listing/listing-landmark.model';
import { ListingFAQ } from '../listing/listing-faq.model';
import { ListingAmenity } from '../listing/listing-amenity.model';
import { ListingLocation } from '../listing/listing-location.model';
import { ListingPlanDimension } from '../listing-plan/listing-plan-dim.model';
import { House } from '../listing-meta/house.model';
import { RefreshToken } from 'src/auth/auth.model';

const ConnectObj = {
  host: (process.env.DB_HOST as string) || undefined,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER as string,
  database: process.env.DB_NAME as string,
  password: process.env.DB_PASS as string,
};
console.log(ConnectObj, 'Connects String');

export const databaseConfig: SequelizeModuleAsyncOptions = {
  useFactory: async () => {
    const sequelize = new Sequelize({
      dialect: 'mysql',
      host: ConnectObj.host,
      port: ConnectObj.port,
      username: ConnectObj.username,
      password: ConnectObj.password,
      database: ConnectObj.database,
      logging: false,
    });
    sequelize.addModels([
      User,
      Business,
      Listing,
      ListingAmenity,
      ListingLocation,
      ListingLandmark,
      ListingFAQ,
      House,
      ListingPlan,
      ListingPlanDimension,
      ListingPlanOption,
      Customer,
      Purchase,
      Review,
      ReviewReply,
      SiteInspection,
      NextOfKin,
      Wishlist,
      UserBusiness,
      SharedWishlist,
      ImageLabel,
      Image,
      ListingImage,
      BusinessImage,
      PromoCode,
      RefreshToken,
    ]);
    await sequelize.sync();
    return sequelize.options;
  },
};

// export const databaseProviders = [
//   {
//     provide: 'SEQUELIZE',
//     useFactory: async () => {
//       const sequelize = new Sequelize({
//         dialect: 'mysql',
//         host: 'localhost',
//         port: 3306,
//         username: 'krikia',
//         password: 'krikia',
//         database: 'KrikiaDB',
//         // sync: true
//       });
//       sequelize.addModels([User, Business, Listing, ListingPlan, ListingPlanOption, Purchase, Review, ReviewReply, SharedWishlist, Customer]);
//       await sequelize.sync();
//       return sequelize;
//     },
//   },
// ];
