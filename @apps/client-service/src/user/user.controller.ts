import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CompleteUserProfileDTO,
  PayForListingDTO,
  UpdateUserDTO,
} from './user.dto';
import { UpdateNextOfKinDTO } from '../next-of-kin/next-of-kin.dto';
import { CreateReviewDTO } from '../review/review.dto';
import { CreateSiteInspectionDTO } from '../site-inspection/site-inspection.dto';
import { CreateBusinessDTO } from '../business/business.dto';
import { Request, Response } from 'express';
import { CreateWishlistDTO } from '../wishlist/wishlist.dto';
import { CreateSharedWishlistDTO } from '../shared-wishlist/shared-wishlist.dto';
import { RemoveKeysInterceptor } from 'src/+common/interceptors/RemoveKeysInterceptor';

@Controller('user')
@UseInterceptors(new RemoveKeysInterceptor(['password']))
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUserLoggedInStatus(@Req() req: Request) {
    return Boolean(req.user);
  }

  @Get('profile')
  getUserProfile() {
    return this.userService.findById();
  }

  @Patch('profile')
  updateUserProfile(@Body() updateBody: UpdateUserDTO) {
    return this.userService.update(updateBody);
  }

  @Patch('profile/complete')
  completeUserProfile(@Body() updateBody: CompleteUserProfileDTO) {
    return this.userService.completeUserProfile(updateBody);
  }

  @Get('contents-stats')
  async getContentStats(@Res() res: Response) {
    const stat = await this.userService.contentStats();
    res.json(stat);
  }

  @Get('profile/next-of-kin')
  getUserNextOfKinProfile() {
    return this.userService.nextOfKinProfile();
  }

  @Patch('profile/next-of-kin')
  updateUserNextOfKinProfile(@Body() updateBody: UpdateNextOfKinDTO) {
    return this.userService.updateNextOfKin(updateBody);
  }

  @Get('purchases')
  getUserPurchases() {
    return this.userService.purchases();
  }

  @Get('purchases/:purchaseId')
  getUserPurchase(@Param('purchaseId') purchaseId: string) {
    return this.userService.purchase(purchaseId);
  }

  @Get('can-review-after-inspection/:listingId')
  canReview() {
    return true;
  }

  @Post('review')
  makeReview(@Body() makeReviewBody: CreateReviewDTO) {
    return this.userService.makeReview(makeReviewBody);
  }

  @Get('reviews')
  getReview() {
    return this.userService.getReviews();
  }

  @Post('site-inspection')
  bookForSiteInspection(
    @Body() createSiteInspectionBody: CreateSiteInspectionDTO,
  ) {
    return this.userService.createSiteInspection(createSiteInspectionBody);
  }

  @Get('site-inspection')
  getAllBookedSiteInspections() {
    return this.userService.getAllSiteInspections();
  }

  @Get('in-business')
  getCheckUserInBusiness() {
    return this.userService.getUserInBusiness();
  }

  @Get('businesses')
  getBusinessList() {
    return this.userService.getBusinesses();
  }

  @Get('businesses/1')
  async getIfOneBusiness() {
    return await this.userService.getUserBusinessIfOne();
  }

  @Post('wallet/create')
  async createUserWallet(@Req() req: any) {
    return await this.userService.createWallet(req.user.email);
  }

  @Get('wallet')
  async getUserWallets(@Req() req: any) {
    return await this.userService.getWallets(req.user.email);
  }

  @Post('wishlist')
  async createWishlistItem(@Body() createWishlistBody: CreateWishlistDTO) {
    return await this.userService.createWishlistItem(createWishlistBody);
  }

  @Delete('wishlist/remove/:itemId')
  async deleteWishlistItem(@Param('itemId') itemId: string) {
    return await this.userService.deleteWishlistItem(itemId);
  }

  @Get('wishlist')
  async getWishlist() {
    return await this.userService.getWishlist();
  }

  @Get('wishlist/mini')
  async getWishlistMini() {
    return await this.userService.getMiniWishlist();
  }

  @Post('wishlist/share')
  async createSharedWishlist(
    @Body() createSharedWishlistBody: CreateSharedWishlistDTO,
  ) {
    return await this.userService.createSharedWishlist(
      createSharedWishlistBody,
    );
  }

  @Post('pay')
  async payForListing(@Body() userPayBody: PayForListingDTO) {
    return await this.userService.pay(userPayBody);
  }

  @Delete('logout')
  logoutUser(@Res() res: Response) {
    this.userService.logout();

    // Delete cookies from client
    res.cookie('__uAud', null, { maxAge: 1, httpOnly: true });
    res.cookie('__ASSEMBLYsxvscz090619_', null, { maxAge: 1, httpOnly: true });

    res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
