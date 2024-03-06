import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Image } from './image.model';
import { ImageLabel } from './image-label.model';
import { ListingImage } from './listing-image-model';
import { BusinessImage } from './business-image.model';
import { ClsService } from 'nestjs-cls';
import { CreateBusinessImageDTO, CreateImageDTO, CreateImageLabelDTO, CreateListingImageDTO } from './image.dto';

@Injectable()
export class ImageService {
    constructor(
        @InjectModel(Image) private readonly image: typeof Image,
        @InjectModel(ImageLabel) private readonly label: typeof ImageLabel,
        @InjectModel(ListingImage) private readonly listingImage: typeof ListingImage,
        @InjectModel(BusinessImage) private readonly businessImage: typeof BusinessImage,
        private readonly cls: ClsService,
    ){}

    async findImageLabelByBusinessId(businessId: string){
        return this.label.findOne({ where: { businessId } });
    }

    async createImage(createImageBody: CreateImageDTO){
        return await this.image.create(createImageBody as any);
    }

    async bulkCreate(createImageBody: CreateImageDTO[]){
        // Get label if image has label
        return await this.image.bulkCreate(createImageBody as any);
    }

    async bulkCreateListingImage(createImageBody: {listingId: string, imageId: string}[]){
        // Get label if image has label
        return await this.image.bulkCreate(createImageBody as any);
    }

    async createImageLabel(createLabelBody: CreateImageLabelDTO){
        // if(!this.cls.get("businessId")){
        //     throw new HttpException("Sorry, business not found", HttpStatus.NOT_FOUND);
        // }

        return await this.label.create({ label: createLabelBody.label, businessId: this.cls.get("businessId") ?? "fddfc899-6c4f-4c5a-8cdd-4aa8a737b02d" });
    }

    async createListingImage(createListingImageBody: CreateListingImageDTO){
        const images = await this.image.bulkCreate((createListingImageBody.images as any));
        const listingImagesList: any[] = images.map(image => ({ imageId:image.id, listingId: createListingImageBody.listingId }));
        return await this.listingImage.bulkCreate(listingImagesList);
    }

    async createBusinessImage(createBusinessImageBody: CreateImageDTO){
        const images = await this.image.bulkCreate((createBusinessImageBody as any));
        const businessImagesList: any[] = images.map(image => ({ imageId:image.id, businessId: this.cls.get("businessId") }));
        return await this.businessImage.bulkCreate(businessImagesList);
    }
}
