import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Image } from './image.model';
import { ImageLabel } from './image-label.model';
import { ListingImage } from './listing-image-model';
import { BusinessImage } from './business-image.model';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    SequelizeModule.forFeature([Image, ImageLabel, ListingImage, BusinessImage]),
    ClsModule.forRoot({
      middleware: {
        // automatically mount the
        // ClsMiddleware for all routes
        mount: true,
        // and use the setup method to
        // provide default store values.
        setup: (cls, req) => {
          cls.set('businessId', req.user?.bizId);
        },
      },
    })
  ],
  providers: [ImageService],
  exports: [
    ImageService
  ]
})
export class ImageModule {}
