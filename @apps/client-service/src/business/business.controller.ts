import { Body, Controller, Delete, Get, Param, Query, Patch, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { BusinessService } from './business.service';
import { UpdateBusinessDTO } from './business.dto';
import { CreateListingBasicInformationDTO, CreateListingBindingAgreeDTO, CreateListingDTO, CreateListingMediaDTO, CreateListingMetaDataDTO, CreateListingPricingPlanDTO, UpdateListingDTO } from '../listing/listing.dto';
import { Response } from 'express';

@Controller('business/:businessId')
@UsePipes(
    new ValidationPipe({
        transform: true,
        whitelist: true
    })
)
export class BusinessController {

    constructor(private readonly bizService: BusinessService){}

    @Get()
    async getBusiness(@Req() req: any){
        return await this.bizService.findById(req.bizId);
    }

    @Patch()
    updateBusiness(@Body() updateBody: UpdateBusinessDTO, @Req() req: any){
        return this.bizService.update(req.bizId, updateBody);
    }

    @Delete()
    deleteBusiness(@Req() req: any){
        return this.bizService.delete(req.bizId);
    }

    @Get("profile")
    getBusinessProfile(@Req() req: any){
        return this.bizService.findById(req.bizId);
    }

    @Get("viewable")
    canViewBusiness(){
        return true;
    }

    @Get("listing/verify-creation-progress")
    async verifyListingCreationProgress(@Query() query: any, @Res() res: Response){
       const verified = await this.bizService.verifyListingCreationProgress(query.token, query.pageId);
       return res.json(verified);
    }

    @Post("listing/basic-information")
    async createNewListingBasicInformation(@Body() createListingBody: CreateListingBasicInformationDTO, @Req() req: any, @Res() res: Response){
       const token = await this.bizService.createListingBasicInformation(req.bizId, createListingBody);
       return res.json(token);
    }

    @Post("listing/media")
    async createNewListingMedia(@Body() createListingBody: CreateListingMediaDTO[], @Query("progress") progress: string, @Req() req: any){
       return await this.bizService.createListingMedia(req.bizId, progress, createListingBody);
    }

    @Post("listing/pricing")
    async createNewListingPricing(@Body() createListingBody: CreateListingPricingPlanDTO, @Query("progress") progress: string, @Req() req: any){
       return await this.bizService.createListingPricing(progress, createListingBody);
    }

    @Post("listing/meta-data")
    async createNewListingMetaData(@Body() createListingBody: CreateListingMetaDataDTO, @Query("progress") progress: string, @Req() req: any){
       return await this.bizService.createListingMetaData(progress, createListingBody);
    }

    @Post("listing/summary")
    async createNewListingSummary(@Body() createListingBody: CreateListingBindingAgreeDTO, @Query("progress") progress: string, @Req() req: any){
       return await this.bizService.createListingSummary(req.bizId, progress);
    }

    @Get("listings")
    getAllListings(@Req() req: any){
        return this.bizService.getListings(req.bizId);
    }

    @Get("listings/:listingId")
    getSingleListing(@Param("listingId") listingId: string, @Req() req: any){
        return this.bizService.getListing(req.bizId, listingId);
    }

    @Patch("listings/:listingId")
    editListing(@Param("listingId") listingId: string, @Body() updateListingBody: UpdateListingDTO, @Req() req: any){
        return this.bizService.updateListing(req.bizId, listingId, updateListingBody);
    }

    @Delete("listings/:listingId")
    deleteListing(@Param("listingId") listingId: string, @Req() req: any){
        return this.bizService.deleteListing(req.bizId, listingId);
    }

    @Get("site-inspections")
    getAllBookedSiteInspections(@Req() req: any){
        return this.bizService.getSiteInspections(req.bizId);
    }

    @Get("wallet")
    getWalletInfo(@Req() req: any){
        return this.bizService.getWallet(req.bizId);
    }

    @Get("transaction-summary")
    getTransactionsSummary(@Req() req: any){
        return this.bizService.getTransactionSummary(req.bizId);
    }

    @Get("orders-summary")
    getOrdersSummary(@Req() req: any){
        return this.bizService.getOrdersSummary(req.bizId);
    }

    @Get("recent-activities")
    getRecentActivitiesSummary(@Req() req: any){
        return this.bizService.getRecentActivities(req.bizId);
    }

    @Get("orders")
    getOrders(@Req() req: any){
        return this.bizService.getOrders(req.bizId);
    }

    @Get("orders/:orderId")
    getOrder(@Param("orderId") orderId: string, @Req() req: any){
        return this.bizService.getOrder(req.bizId, orderId);
    }

    @Get("customers")
    getAllCustomers(@Req() req: any){
        return this.bizService.getCustomers(req.bizId);
    }

    @Get("customers/:customerId")
    getCustomer(@Param("customerId") customerId: string, @Req() req: any){
        return this.bizService.getCustomer(req.bizId, customerId);
    }

}
