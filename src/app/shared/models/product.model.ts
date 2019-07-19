import { User } from './user.model';

export interface PriceAndFiles {
    fileName: string;
    file: string;
    price: number;
}



export interface Product {
    name: string;
    description: string;
    shortDescription: string;
    featuredImage?: string;
    createdBy: User;
    priceAndFiles?: PriceAndFiles[];
    totalPrice: number;
    categories?: [];
    demo_url?: string;
    documentation_url?: string;
    video_url?: string;
    status: ProductStatus;
}

export enum ProductStatus {
    Created = 'Created',
    Drafted = 'Drafted',
    Submitted = 'Submitted',
    Approved = 'Approved',
    Rejected = 'Rejected',
    Archieved = 'Archieved',
    Deleted = 'Deleted'
}
