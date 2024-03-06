import { Module } from '@nestjs/common';
import { UserBusinessService } from './user-business.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserBusiness } from './user-business.model';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    SequelizeModule.forFeature([UserBusiness]),
    ClsModule.forRoot({
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        // and use the setup method to
        // provide default store values.
        setup: (cls, req) => {
          cls.set('userId', req.user?.id);
          cls.set('businessId', req.user?.bizId);
        },
      },
    }),
  ],
  providers: [UserBusinessService],
  exports: [UserBusinessService]
})
export class UserBusinessModule {}
