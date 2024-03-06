import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Wishlist } from './wishlist.model';

@Module({
  imports: [SequelizeModule.forFeature([Wishlist])],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
