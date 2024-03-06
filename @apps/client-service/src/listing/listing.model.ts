import { Column, DataType, Table, Model, HasMany, HasOne, BelongsTo, ForeignKey, BeforeCreate, AfterCreate, BeforeBulkCreate } from "sequelize-typescript";
import { ListingPlan } from "../listing-plan/listing-plan.model";
import { Wishlist } from "../wishlist/wishlist.model";
import { Business } from "../business/business.model";
import { v4 } from "uuid";
import { UniqueList } from "../+utils/data-structs";
import { ListingImage } from "../image/listing-image-model";
import { ListingFAQ } from "./listing-faq.model";
import { House } from "src/listing-meta/house.model";
import { ListingLandmark } from "./listing-landmark.model";
import { ListingAmenity } from "./listing-amenity.model";
import { ListingLocation } from "./listing-location.model";
import { genUUID } from "src/+utils/common";

@Table
export class Listing extends Model {

  @Column({defaultValue: 0, primaryKey: true})
  id: string;

  @Column({ allowNull: true })
  name: string;

  @Column({ defaultValue: '' })
  slug: string;

  @Column({ allowNull: true })
  title: string;

  @Column({ allowNull: true, type: DataType.ENUM("House", "Land", "Shop") })
  type: 'House' | 'Land' | 'Shop' | null;

  @Column({ defaultValue: 'Draft' })
  status: 'Active' | 'Inactive' | 'Private' | 'Draft' | 'Rejected' | 'Pending';

  @Column({ allowNull: true})
  description: string;

  @ForeignKey(()=> Business)
  businessId: string;

  @BelongsTo(()=> Business)
  business: Business;

  @HasMany(()=> ListingAmenity)
  amenities: ListingAmenity[];

  @HasMany(()=> ListingFAQ)
  freqAskedQuestions: ListingFAQ[];

  @HasMany(()=> ListingLandmark)
  landmarks: ListingLandmark[];

  @HasMany(()=> ListingPlan)
  plans: ListingPlan[];

  @HasOne(()=> ListingLocation)
  location: ListingLocation;

  @HasOne(()=> Wishlist)
  wishlist: Wishlist;

  @HasMany(()=> ListingImage)
  images: ListingImage[];

  @BeforeCreate
  static beforeInstanceCreate(listing: any){
    listing.id = genUUID();
  }

  @BeforeBulkCreate
  static beforeInstanceBulkCreate(models: any[]){
    models.forEach(model => model.id = genUUID());
  }   

  @Column({type: DataType.VIRTUAL})
  get planCuratedDurations() {
        if (this.plans && this.plans.length > 0) {
            let durations: any[] = this.plans.map((plan: any) => plan.options.map((option: any) => option.paymentDuration))

            durations = durations.reduce((durs: number[], dur: [x:number])=> {
                return [...durs, ...dur]
            }, [])

            return [
                {label: "Outright", value: 0},
                ...UniqueList.Ret(durations).sort((a, b) => a-b)
                .map(dur => ({label: `${dur} Month${["", "s"][Math.max(0, Math.min(1, dur-1))]}`, value: dur}))
            ]
            // .unshift({label: "Outright", value: 0});
        }

        return 0;
  }

  @Column({type: DataType.VIRTUAL})
  get priceRange() {
     
          if (this.plans && this.plans.length > 0) {
              const prices: number[] = this.getDataValue("plans").map((plan: any) => plan.price)
              return UniqueList.Ret([Math.min(...prices), Math.max(...prices)])
          }

          return 0
  }

  @Column({type: DataType.VIRTUAL})
  get sizeRange() {
      if (this.getDataValue("plans")) {
          const sizes: number[] = this.getDataValue("plans").map((plan: any) => plan.size)
          return UniqueList.Ret([Math.min(...sizes), Math.max(...sizes)])
      }

      return 0;
    }
}
