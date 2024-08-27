export interface Scan {date: Date, ipAddress: string, purchaseId: string, userId: string, restaurantId: string, sponsorId: string}

export interface User {
    id?: string;
    uid?: string;
    name?: string;
    country?: string;
    city?: string;
    email: string;
    imageUrl?: string;
    purchases?: [{ packageId: string, purchaseId: string}];
    createdAt?: string;
    type: number;
    paymentCards?: Object[]; 

    //For type 2 users (Restaurants)
    scans?: Scan[];
    restaurantName?: string;
    sponsors?: [{name: string, userId: string}]; //userId is used to get Sponsor Users
    
    //For type 3 users (Sponsors)
    sponsorName?: string;
    restaurants?: [{name: string, userId: string}]; //userId is used to get Restaurant Users
}