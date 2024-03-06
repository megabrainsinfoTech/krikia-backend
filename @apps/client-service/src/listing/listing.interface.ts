export type ListingType = 'House' | 'Land' | 'Shop';
export type ListingStatus = 'Active' | 'Inactive' | 'Private' | 'Draft' | 'Rejected' | 'Pending';

export interface ListingAttributes {
    id: string;
    name: string | null;
    slug: string;
    title: string | null;
    type: ListingType | null;
    fees?: any[];
    houseType: string | null;
    bedrooms: number;
    toilets: number;
    bathrooms: number;
    status: ListingStatus;
    state: string | null;
    country: string | null;
    city: string | null;
    address: string | null;
    description: string;
    freqAskedQues: any[];
    landmarks: any[];
    amenities: any[];
    images: any[];
    video: string | null;
    documents: any[] | null;
    priceRange?: number[]; // Virtual field, so we format the price for display
    sizeRange?: number[]; // Virtual field, so we format the price for display
    planCuratedDurations?: number[]; // Virtual field, so we format the price for display
    plans?: any;
    reviews?: any;
    BusinessId?: string;
  }
  
 export interface ListingCreationAttributes extends Exclude<ListingAttributes, 'id'> {}
  