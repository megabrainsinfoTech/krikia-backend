import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ListingModule } from './listing/listing.module';
import { BusinessModule } from './business/business.module';
import { AuthModule } from './auth/auth.module';
import { ListingPlanModule } from './listing-plan/listing-plan.module';
import { ListingPlanOptionModule } from './listing-plan-option/listing-plan-option.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ReviewModule } from './review/review.module';
import { ReviewReplyModule } from './review-reply/review-reply.module';
import { SharedWishlistModule } from './shared-wishlist/shared-wishlist.module';
import { SiteInspectionModule } from './site-inspection/site-inspection.module';
import { NextOfKinModule } from './next-of-kin/next-of-kin.module';
import { UserBusinessModule } from './user-business/user-business.module';
import { CustomerModule } from './customer/customer.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './database/database.config';
import { GlobalModule } from './global/global.module';
import { WishlistModule } from './wishlist/wishlist.module';

import { ImageModule } from './image/image.module';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { LibMetaModule } from './lib-meta/lib-meta.module';
import { ListingMetaModule } from './listing-meta/listing-meta.module';
import { RemoveKeysInterceptorProvider } from './+common/providers/removeKeyInterceptorProvider';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RemoveKeysInterceptor } from './+common/interceptors/RemoveKeysInterceptor';
import { GlobalMiddleware } from './+common/middlewares/global.middleware';

@Module({
  imports: [
    SequelizeModule.forRootAsync(databaseConfig),
    UserModule,
    ListingModule,
    BusinessModule,
    AuthModule,
    ListingPlanModule,
    ListingPlanOptionModule,
    PurchaseModule,
    ReviewModule,
    ReviewReplyModule,
    SharedWishlistModule,
    SiteInspectionModule,
    NextOfKinModule,
    UserBusinessModule,
    CustomerModule,
    WishlistModule,
    GlobalModule,
    ImageModule,
    PromoCodeModule,
    LibMetaModule,
    ListingMetaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RemoveKeysInterceptorProvider,
    {
      provide: APP_INTERCEPTOR,
      useExisting: RemoveKeysInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GlobalMiddleware).forRoutes('*');
  }
}
