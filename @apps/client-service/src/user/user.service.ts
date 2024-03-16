import {
  HttpException,
  Injectable,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import {
  CreateNewUserPassword,
  CreateUserDTO,
  PayForListingDTO,
  UpdateUserDTO,
  WithEmail,
} from './user.dto';
import { NextOfKinService } from '../next-of-kin/next-of-kin.service';
import { UpdateNextOfKinDTO } from '../next-of-kin/next-of-kin.dto';
import { PurchaseService } from '../purchase/purchase.service';
import { ReviewService } from '../review/review.service';
import { CreateReviewDTO } from '../review/review.dto';
import { CreateSiteInspectionDTO } from '../site-inspection/site-inspection.dto';
import { SiteInspectionService } from '../site-inspection/site-inspection.service';
import { CreateBusinessDTO } from '../business/business.dto';
import { BusinessService } from '../business/business.service';
import redisClient from '../+utils/redisClient';
import { UserBusinessService } from '../user-business/user-business.service';
import { ClsService } from 'nestjs-cls';
import { loadSQL } from '../+utils/loadSQL';
import { QueryTypes } from 'sequelize';
import apiConnect from '../+utils/api-connect';
import { CreateWishlistDTO } from '../wishlist/wishlist.dto';
import { WishlistService } from '../wishlist/wishlist.service';
import { ListingService } from '../listing/listing.service';
import { SharedWishlistService } from '../shared-wishlist/shared-wishlist.service';
import { CreateSharedWishlistDTO } from '../shared-wishlist/shared-wishlist.dto';
import { ListingPlanOptionService } from '../listing-plan-option/listing-plan-option.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly user: typeof User,
    private readonly cls: ClsService,
    private readonly nokService: NextOfKinService,
    private readonly purchaseService: PurchaseService,
    private readonly reviewService: ReviewService,
    private readonly siteInspectionService: SiteInspectionService,
    private readonly businessService: BusinessService,
    private readonly userBusinessService: UserBusinessService,
    private readonly wishlistService: WishlistService,
    private readonly sharedWishlistService: SharedWishlistService,
    private readonly listingService: ListingService,
    private readonly listingPlanOptionService: ListingPlanOptionService,
  ) {}

  async create(createBody: CreateNewUserPassword & WithEmail) {
    return await this.user.create({
      ...(createBody as any),
      status: 'Incomplete',
    });
  }

  async completeBasicProfileNewUSer(createBody: CreateUserDTO) {
    return await this.user.create({ ...createBody, status: 'Active' });
  }

  async findById() {
    return await this.user.findByPk(this.cls.get('userId'));
  }

  async findByEmail(email: string) {
    return await this.user.findOne({ where: { email } });
  }

  async update(updateBody: UpdateUserDTO) {
    await this.user.update(updateBody, {
      where: { id: this.cls.get('userId') },
    });
    return { message: 'Profile updated successfully' };
  }

  async delete() {
    await this.user.destroy({ where: { id: this.cls.get('userId') } });
  }

  async contentStats() {
    // const stats = await this.user.sequelize?.query(
    //   loadSQL('user-contents-stats'),
    //   {
    //     type: QueryTypes.SELECT,
    //     replacements: {
    //       userId: this.cls.get('userId'),
    //     },
    //   },
    // );
    return {};
  }

  nextOfKinProfile() {
    return this.nokService.findByUserId(this.cls.get('userId'));
  }

  updateNextOfKin(updateBody: UpdateNextOfKinDTO) {
    return this.nokService.update(this.cls.get('userId'), updateBody);
  }

  purchases() {
    return this.purchaseService.findAllByUserId(this.cls.get('userId'));
  }

  purchase(purchaseId: string) {
    return this.purchaseService.findOneByUserId(
      this.cls.get('userId'),
      purchaseId,
    );
  }

  async pay(userPayBody: PayForListingDTO) {
    try {
      const {
        amount,
        totalAmount,
        paymentFrequency,
        listingPlanOptionId,
        fnxReceiverAddress,
        purchaseId,
      } = userPayBody;
      const user = await this.user.findOne({
        where: { id: this.cls.get('userId') },
        attributes: ['fnxAccountAddress'],
      });
      // const option = await ListingPlanOption.findByPk(listingPlanOptionId, {
      //     include: [
      //         {
      //             model: ListingPlan,
      //             as: "ListingPlan"
      //         }
      //     ],
      //     attributes: ["id"]
      // });

      // if(!(option as any).plan){
      //     throw errors.NOT_FOUND("Listing plan not found");
      // }

      const purchasePayload = {
        amount,
        senderRef: user?.fnxAccountAddress,
        receiverRef: fnxReceiverAddress,
      };

      // Make payment
      // const payment = await apiConnect(process.env.PAYMENT_SERVICE_URL as string, { Authorization: process.env.PAYMENT_SERVICE_SECRET }).post(`pay?isOutright=${false}`, purchasePayload);

      // After making payment, create purchase entry
      // Check if purchase exist
      let purchase = await this.purchaseService.findById(purchaseId!);
      const listingPlanOption = await this.listingPlanOptionService.findById(
        listingPlanOptionId,
      );
      if (purchase) {
        purchase.set({ paidAmount: purchase.paidAmount + amount });
        purchase.save();
      } else {
        purchase = await this.purchaseService.create({
          paidAmount: amount,
          totalAmount,
          paymentFrequency: paymentFrequency,
          listingPlanOptionId,
          userId: this.cls.get('userId'),
          paymentDuration: listingPlanOption?.paymentDuration || 0,
        });
      }

      return { message: `Payment for ${amount} is successful` };
    } catch (err) {
      throw err;
    }
  }

  makeReview(makeReviewBody: CreateReviewDTO) {
    return this.reviewService.create(makeReviewBody);
  }

  getReviews() {
    return this.reviewService.findAllByUserId(this.cls.get('userId'));
  }

  createSiteInspection(createSiteInspectionBody: CreateSiteInspectionDTO) {
    return this.siteInspectionService.create(createSiteInspectionBody);
  }

  getAllSiteInspections() {
    return this.siteInspectionService.findAllByUserId(this.cls.get('userId'));
  }

  async getBusinesses() {
    return await this.userBusinessService.findAllByUserId();
  }

  async getUserBusinessIfOne() {
    return await this.userBusinessService.findOneByUserId();
  }

  async getUserInBusiness() {
    return await this.userBusinessService.findBooleanUserInBusiness();
  }

  async createWallet(userEmail: string) {
    try {
      const wallet = (
        await apiConnect(process.env.PAYMENT_SERVICE_URL as string).post(
          'wallet/create',
          { holderEmail: userEmail, type: 'User' },
        )
      ).data;
      return wallet;
    } catch (err) {
      throw err;
    }
  }

  async getWallets(userEmail: string) {
    try {
      const wallets = (
        await apiConnect(process.env.PAYMENT_SERVICE_URL as string, {
          Authorization: `AppAccess${userEmail}`,
        }).get('wallet')
      ).data;
      return wallets;
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, err.statusCode);
      // throw err;
    }
  }

  async createWishlistItem(createWishlistBody: CreateWishlistDTO) {
    await this.wishlistService.create(
      this.cls.get('userId'),
      createWishlistBody,
    );
    return { message: 'Item added to wishlist' };
  }

  async deleteWishlistItem(itemId: string) {
    await this.wishlistService.delete(itemId, this.cls.get('userId'));
    return { message: 'Item removed from wishlist' };
  }

  async getWishlist() {
    return await this.listingService.findWishlistByUserId(
      this.cls.get('userId'),
    );
  }

  async getMiniWishlist() {
    return await this.listingService.findMiniWishlistByUserId(
      this.cls.get('userId'),
    );
  }

  async createSharedWishlist(
    createSharedWishlistBody: CreateSharedWishlistDTO,
  ) {
    return await this.sharedWishlistService.create(createSharedWishlistBody);
  }

  async logout() {
    // remove refresh token from redis datastore
    (await redisClient).DEL(this.cls.get('userId'));
  }
}
