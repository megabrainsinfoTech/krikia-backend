import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Listing } from './listing.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateListingDTO, UpdateListingDTO } from './listing.dto';
import { Op, QueryTypes } from 'sequelize';
import { ListingPlan } from '../listing-plan/listing-plan.model';
import { ListingPlanOption } from '../listing-plan-option/listing-plan-option.model';
import { loadSQL } from '../+utils/loadSQL';
import { Wishlist } from '../wishlist/wishlist.model';
import { SharedWishlistService } from '../shared-wishlist/shared-wishlist.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { ListingImage } from '../image/listing-image-model';
import { Image } from '../image/image.model';
import { ListingLocation } from './listing-location.model';
import { ListingFAQ } from './listing-faq.model';
import { ListingAmenity } from './listing-amenity.model';
import { House } from '../listing-meta/house.model';
import { ListingPlanService } from '../listing-plan/listing-plan.service';
import { ListingLandmark } from './listing-landmark.model';

@Injectable()
export class ListingService {

    constructor(
        @InjectModel(Listing) private readonly listing: typeof Listing,
        private readonly listingPlanService: ListingPlanService,
        private readonly sharedWishlistService: SharedWishlistService,
        private readonly wishlistService: WishlistService
    ){}

    async create(createBody: any){
        try {
            const listing = (await this.listing.create(createBody, {
                include: [ ListingLocation, ListingFAQ, ListingAmenity ]
            }))
            return listing;
        } catch(err){
            console.log(err)
        }
    }

    async createListingPricingPlan(listingId: string, createBody: any){
        // Update listing with listingType
        const plans = createBody.plans.map((plan: any) => ({...plan, listingId}));
        const listing = await this.listing.findByPk(listingId); //Fetch listing
        listing?.set({ type: createBody.listingType }) // Update listing type
        listing?.save() // Listing listing to DB
        
        await this.listingPlanService.create(plans); //Create pricing plans

        // Return listing
        return listing;
    }

    async createIncluded(listingId: string, createBody: any){
        // This services handles the creation of landmarks, amenities and faqs and other fields that are pass to it
        // Fetch listing


       try {

            const listing = await this.listing.findOne({ where: { id: listingId } });
            // Create those entries
            (await ListingLandmark.bulkCreate(createBody.landmarks)).forEach(entry => {
                entry.set({listingId: listing?.id});
                entry.save();
            });
            (await ListingAmenity.bulkCreate(createBody.amenities)).forEach(entry => {
                entry.set({listingId: listing?.id});
                entry.save();
            });
            (await ListingFAQ.bulkCreate(createBody.freqAskedQuestions)).forEach(entry => {
                entry.set({listingId: listing?.id});
                entry.save();
            });

            return listing;

       } catch(err){
        console.log(err)
       }

     
        return 0;
    }

    async bindListingSubmission(listingId: string){
        return await this.listing.update({ status: "PActive" }, { where: { id: listingId } });
    }

    async findById(id: string){
        return await this.listing.findByPk(id);
    }

    async findBySlugWithNested(slug: string, userId: string){
        return await this.listing.findOne({
            where: {
             [Op.or]: { slug, id: slug }
            },
            include: [
                {
                    model: ListingPlan,
                    include: [ListingPlanOption]
                },
                {
                    model: Wishlist,
                    required: false,
                    where: {
                        userId: userId ?? "233r2r234234"
                    }
                }
            ]
        })
    }
    

    async findMiniWishlistByUserId(userId: string){
        return await this.listing.findAll({
            include: [
                {
                    model: Wishlist,
                    where: { userId },
                    attributes: []
                }
            ],
            attributes: ["id", "name", "createdAt", "type"]
        })
    }

    async findWishlistByUserId(userId: string){
        const wishlist = await this.wishlistService.findByUserId(userId);
        const listings = await this.listing.findAll({
            include: [
                {
                    model: ListingPlan,
                    include: [ListingPlanOption]
                },
                {
                    model: Wishlist,
                    where: { userId },
                    attributes: []
                }
            ]
        })

        return { id: wishlist?.id, listings };
    }

    async findBySlugWithSiteInspection(slug: string){

        const listing = await this.listing.findOne({
            where: {
             [Op.or]: { slug, id: slug }
            },
            attributes: ["id"]
        })

        return 
    }

    async findBySlugWithBusinessDetails(slug: string){

        const listing = await this.listing.findOne({
            where: {
             [Op.or]: { slug, id: slug }
            },
            attributes: ["id"]
        })

        // return this.globalService.findBusinessById((listing?.businessId as string));
    }

    async findBySlugWithRatingsReviewDetails(slug: string){

        const listing = await this.listing.findOne({
            where: {
             [Op.or]: { slug, id: slug }
            },
            attributes: ["id"]
        })

        const listingReviewDetails = await this.listing.sequelize?.query(loadSQL("listing-rating-review-details"), {
            type: QueryTypes.SELECT,
            replacements: {
                listingId: listing?.id
            }
        });

        return listingReviewDetails;

    }

    async findBySlugWithReviews(slug: string){
        const listing = await this.listing.findOne({
            where: {
             [Op.or]: { slug, id: slug }
            },
            attributes: ["id"]
        })

        const reviews = await this.listing.sequelize?.query(loadSQL("get-listing-reviews"), {
            type: QueryTypes.SELECT,
            replacements: {
                listingId: listing?.id
            }
        });

        return reviews;
    }

    async findBySlugWithPaymentInformation(slug: string, query: any){
        const { paymentFrequency, mapping, dur } = query;
        let queryRes;

        const listing = await this.listing.findOne({
            where: {
             [Op.or]: { slug, id: slug }
            },
            attributes: ["id"]
        })

        if(!listing){
            throw new HttpException("Listing not found", HttpStatus.NOT_FOUND);
        }

        if(!dur || dur === "0"){
    
            queryRes = await this.listing.sequelize?.query(loadSQL("payment-info-outright-query"), {
                replacements: {
                    id: listing?.id,
                    size: mapping
                },
                type: QueryTypes.SELECT
            })

        } else {
            const query = loadSQL("payment-info-dur-query");
            queryRes = await this.listing.sequelize?.query(query, {
                replacements: {
                    id: listing?.id,
                    size: mapping,
                    pDuration: dur,
                    paymentFrequency: paymentFrequency

                },
                type: QueryTypes.SELECT
            })
        }

        return ({...(queryRes?.[0]), tier: paymentFrequency})

    }

    async update(id: string, updateBody: UpdateListingDTO){
        await this.listing.update(updateBody, { where: { id } });
    }

    async delete(id: string, businessId: string){
        await this.listing.destroy({ where: { id, businessId } });
    }

    async findAll(userId: string){
        const listings = await this.listing.findAll({
            include: [
                {
                    model: ListingImage,
                    include: [ Image ]
                },
                {
                    model: ListingPlan,
                    include: [ ListingPlanOption ]
                },
                {
                    model: Wishlist,
                    required: false,
                    where: {
                        userId: userId ?? "233r2r234234"
                    }
                }
            ],
            where: { status: "Active" }
        });
        return listings;
    }
    

    async findAllByBusinessId(bizId: string){
        const listings = await this.listing.findAll({ where: { BusinessId: bizId } });
        return listings;
    }

    async findOneByBusinessId(bizId: string, listingId: string){
        const listing = await this.listing.findOne({ where: { id: listingId,  BusinessId: bizId } });
        return listing;

    }

    async findAllSharedByUrl(shareUrl: string){

        const sharedWishlist = await this.sharedWishlistService.findById(shareUrl);
        const user = await this.wishlistService.findUserBySharedWishlistId((sharedWishlist?.id as string));
        let listings;

        if(sharedWishlist?.payload == "shareAll"){
            listings = await this.listing.findAll({
                include: [
                    {
                        model: Wishlist,
                        attributes: []
                    },
                    {
                        model: ListingPlan,
                        as: "plans",
                        include: [
                            {
                                model: ListingPlanOption,
                                as: "options"
                            }
                        ]
                    }
                ],
            });
        } else {
            listings = await this.listing.findAll({
                include: [
                    {
                        model: Wishlist,
                        where: {
                            listingId: sharedWishlist?.payload
                        },
                        attributes: []
                    },
                    {
                        model: ListingPlan,
                        as: "plans",
                        include: [
                            {
                                model: ListingPlanOption,
                                as: "options"
                            }
                        ]
                    }
                ],
            });
        }

        return { listings, user };
    }

}
