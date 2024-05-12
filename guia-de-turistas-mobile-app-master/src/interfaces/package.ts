export interface Package {
    id?: string;
    name?: string;
    city?: string;
    imageUrl?: string;
    schedule?: string;
    brandImageUrl?: string;
    restaurantImageUrl?: string;
    videoUrl?: string;
    restaurant?: string;
    restaurantId?: string;
    restaurantOpeningHour?: string;
    restaurantClosingHour?: string;
    sponsor?: string;
    sponsorId?: string;
    price?: number;
    restaurantPrice?: number;
    description?: string;
    restaurantDescription?: string;
    purchases?: [{userId: string, purchaseId: string, reservationDate: string, quantity: number}];
    totalPerDay?: number;
    images?: [{imageUrl: string, imageTitle: string}];
    instagramUser?: string;
    facebookUser?: string;
    tags?: string;
    location?: string,
    weekDaysAvailable?: {monday: boolean, tuesday: boolean, wednesday: boolean, thursday: boolean, friday: boolean, saturday: boolean, sunday: boolean};
}