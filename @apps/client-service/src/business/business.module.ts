import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { UserAuthMiddleware } from '../+common/user-auth/user-auth.middleware';
import { BusinessAuthMiddleware } from '../+common/business-auth/business-auth.middleware';
import { SequelizeModule } from '@nestjs/sequelize';
import { Business } from './business.model';
import { ListingModule } from '../listing/listing.module';
import { SiteInspectionModule } from '../site-inspection/site-inspection.module';
import { UserBusinessModule } from '../user-business/user-business.module';
import { ClsModule } from 'nestjs-cls';
import { CustomerModule } from '../customer/customer.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Business]), forwardRef(()=> ListingModule), ImageModule,SiteInspectionModule, UserBusinessModule, CustomerModule,
    ClsModule.forRoot({
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        // and use the setup method to
        // provide default store values.
        setup: (cls, req) => {
          cls.set('businessId', req?.bizId);
        },
      },
    }),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService]
})
export class BusinessModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware, BusinessAuthMiddleware)
    .forRoutes("business/:businessId")
  }
}
