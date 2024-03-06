import { Module } from '@nestjs/common';
import { SharedWishlistService } from './shared-wishlist.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedWishlist } from './shared-wishlist.model';

@Module({
  imports: [SequelizeModule.forFeature([SharedWishlist])],
  providers: [SharedWishlistService],
  exports: [SharedWishlistService]
})
export class SharedWishlistModule {}
