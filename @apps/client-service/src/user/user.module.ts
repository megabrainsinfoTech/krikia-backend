import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserAuthMiddleware } from '../+common/user-auth/user-auth.middleware';
import { WishlistModule } from '../wishlist/wishlist.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { NextOfKinModule } from '../next-of-kin/next-of-kin.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { ReviewModule } from '../review/review.module';
import { SiteInspectionModule } from '../site-inspection/site-inspection.module';
import { BusinessModule } from '../business/business.module';
import { UserBusinessModule } from '../user-business/user-business.module';
import { ClsModule } from 'nestjs-cls';
import { ListingModule } from '../listing/listing.module';
import { SharedWishlistModule } from '../shared-wishlist/shared-wishlist.module';
import { ListingPlanOptionModule } from '../listing-plan-option/listing-plan-option.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    NextOfKinModule,
    PurchaseModule,
    ReviewModule,
    SiteInspectionModule,
    BusinessModule,
    UserBusinessModule,
    WishlistModule,
    ListingModule,
    ListingPlanOptionModule,
    SharedWishlistModule,
    ClsModule.forRoot({
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        // and use the setup method to
        // provide default store values.
        setup: (cls, req) => {
          cls.set('userId', req.user?.id);
          cls.set('userEmail', req.user?.email);
        },
      },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes('user');
  }
}
