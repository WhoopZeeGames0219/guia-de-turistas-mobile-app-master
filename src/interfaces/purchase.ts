export interface Purchase{
    id?: string;
    packageId?: string;
    restaurantId?: string;
    sponsorId?: string;
    pakageName?: string;
    imageUrl?: string;
    purchaseDate?: Date;
    reservationDate?: string;
    quantity?: number;
    price?:number;
    validated?: boolean;
    paid?: boolean;
}