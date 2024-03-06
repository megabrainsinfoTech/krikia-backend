import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from './business.model';
import { CreateBusinessDTO, UpdateBusinessDTO, UpdateBusinessStatusDTO } from './business.dto';
import { ListingService } from '../listing/listing.service';
import { CreateListingBasicInformationDTO, CreateListingDTO, CreateListingMediaDTO, CreateListingMetaDataDTO, CreateListingPricingPlanDTO, UpdateListingDTO } from '../listing/listing.dto';
import { SiteInspectionService } from '../site-inspection/site-inspection.service';
import { ClsService } from 'nestjs-cls';
import { CustomerService } from '../customer/customer.service';
import apiConnect from 'src/+utils/api-connect';
import redisClient from 'src/+utils/redisClient';
import { v4 } from 'uuid';
import { encodeBase64Url } from 'src/+utils';
import { IsNumberString } from 'class-validator';
import { ImageService } from '../image/image.service';
import { updateCreateListingProgressStep, verifyCreateListingProgressToken } from 'src/+utils/redis_fn';

@Injectable()
export class BusinessService {

    constructor(
        @InjectModel(Business) private readonly business: typeof Business,
        // private readonly cls: ClsService,
        @Inject(forwardRef(()=> ListingService)) private readonly listingService: ListingService,
        private readonly customerService: CustomerService,
        private readonly imageService: ImageService,
        private readonly siteInspectionService: SiteInspectionService
    ){}

    async create(createBody: CreateBusinessDTO){
        const business = await this.business.create(createBody as any);
        return business;
    }

    async findByBusinessId(id: string){
        return await this.business.findByPk(id);
    }

    async findById(id: string){
        return await this.business.findByPk(id);
    }

    async findAll(){
        return await this.business.findAll();
    }

    async updateById(businessId: string, updateBody: UpdateBusinessStatusDTO){
        await this.business.update(updateBody, { where: { id: businessId } });
        return { message: "Business updated successfully" };
    }

    async update(id: string, updateBody: UpdateBusinessDTO){
        await this.business.update(updateBody, { where: { id } });
        return { message: "Business updated successfully" };
    }

    async delete(id: string){
        await this.business.destroy({ where: { id } });
        return { message: "Business has been deleted" };
    }

   async createListing(id: string, createListingBody: CreateListingDTO){
        await this.listingService.create(createListingBody);
        return { message: "" };
    }

    async createListingBasicInformation(id: string, createListingBody: CreateListingBasicInformationDTO){
        const listing = await this.listingService.create({...createListingBody, businessId: id});

        // Once created, sign unto redis for in-memory storage
        // TODO: Generate short url as key
        const key = encodeBase64Url(`${v4()}listing.id`).slice(1, 15);
        await updateCreateListingProgressStep(key, `${listing?.id}:1`);

        return { token: encodeURIComponent(key), message: `Saved basic information for ${listing?.name}` };
    }

    async verifyListingCreationProgress(progressToken: string, pageId: number){
       const { pageIdx } = await verifyCreateListingProgressToken(progressToken);
      
       if(!!pageIdx){

            const DB_NUM_I = Number(pageId); //DB_NUM_INT

            console.log("DB_NUM_I", DB_NUM_I)
            console.log("PageId", pageId)

            if(DB_NUM_I >= Number(pageId)) {
                return (Number(pageId)) //Goto current page
            } else if((DB_NUM_I < (Number(pageId)))){
                return (DB_NUM_I) //Goto next page
            } else {
                console.log("It came here")
                return 0;
            }
    
       } else {
            return 0;
       }
    }

   async createListingMedia(id: string, progressToken: string, createListingBody: any[]){

        try {

            // Check if business has a listing image label, if not then create
            const listingImageLabel = await this.imageService.findImageLabelByBusinessId(id);
            let labelId = "";
            if(listingImageLabel){
                labelId = listingImageLabel.id;
            } else {
                // Create one
                labelId = (await this.imageService.createImageLabel({ businessId: id, label: "listing" })).id;
            }

            const { listingId } = await verifyCreateListingProgressToken(progressToken);

            // Create image entry for each image
            await this.imageService.createListingImage({listingId, images: createListingBody.map(row => ({...row, labelId }))});
            
            //  Update progress
            await updateCreateListingProgressStep(progressToken, `${listingId}:2`);

            // Fetch listing from DB
            const listing = await this.listingService.findById(listingId);
            return { token: progressToken, message: `Saved listing media for ${listing?.name}` };

        } catch(err){
            console.log(err);
        }

    }

    async createListingPricing(progressToken: string, createListingBody: CreateListingPricingPlanDTO){
        // Get listingId
        const { listingId } = await verifyCreateListingProgressToken(progressToken);
        const listing = await this.listingService.createListingPricingPlan(listingId, createListingBody);

        //  Update progress
        await updateCreateListingProgressStep(progressToken, `${listingId}:3`);

        return { token: progressToken, message: `Saved pricing plan for ${listing?.name}` };
    }

    async createListingMetaData(progressToken: string, createListingBody: CreateListingMetaDataDTO){
         // Get listingId
         const { listingId } = await verifyCreateListingProgressToken(progressToken);
        const listing = await this.listingService.createIncluded(listingId, createListingBody);

        //  Update progress
        await updateCreateListingProgressStep(progressToken, `${listingId}:4`);

        return { token: progressToken, message: `Saved Metadata for ${!!listing && listing.name}` };
    }

    async createListingSummary(id: string, progressToken: string){
        // This service handles agreement binding
        // Get listingId
        const { listingId } = await verifyCreateListingProgressToken(progressToken);
        await this.listingService.bindListingSubmission(listingId);
        // Clear progressToken from Redis
        (await redisClient).DEL(progressToken);
        return { message: "Listing has been submitted to krikia for verification. Do not edit this listing until it is verified" };
    }

    async getListings(id: string){
        return await this.listingService.findAllByBusinessId(id);
    }

    async getListing(id: string, listingId: string){
        return await this.listingService.findOneByBusinessId(id, listingId);
    }

    async updateListing(id: string, listingId: string, updateBody: UpdateListingDTO){
        await this.listingService.update(listingId, updateBody);
        return { message: "Listing updated successfully" };
    }

    async deleteListing(id: string, listingId: string){
        await this.listingService.delete(listingId, id);
        return { message: "Listing has been deleted" };
    }

    getOrders(id: string){

    }

    getOrder(id: string, orderId: string){

    }

    async getCustomers(id: string){
        return await this.customerService.findAllByBusinessId(id);
    }

    getCustomer(id: string, customerId: string){
        return this.customerService.findByBusinessId(id, customerId);
    }

    async getSiteInspections(id: string): Promise<any>{
        return await this.siteInspectionService.findAllByBusinessId(id);
    }

    async getWallet(id: string): Promise<any>{
        try {
            const business = await this.business.findOne({where: {id}, attributes: ["email"]});

        // Returns all user wallets. Since business has only one wallet, we need to extract the first result from wallets
        const wallets = (await apiConnect(process.env.PAYMENT_SERVICE_URL as string, { Authorization: `AppAccess${business?.email}` }).get("wallet")).data;
        return wallets?.[0];
        } catch(err){
            throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    getTransactionSummary(id: string){

    }

    getOrdersSummary(id: string){

    }

    getRecentActivities(id: string){

    }



}
