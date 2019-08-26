import { User } from './user.model';
import { HighlightResult } from 'ngx-highlightjs';
import { BlockToolData } from '@editorjs/editorjs';

export interface PriceAndFiles {
    fileName: string;
    file: string;
    price: number;
}

export interface Tag {
    name: string;
    _id?: string;
}

interface Support {
    time: number;
    description: {
        type: string;
        data: BlockToolData
    };
}



export interface Product {
    name: string;
    description: [{
        type: string;
        data: BlockToolData
    }];
    shortDescription?: string;
    featuredImage?: string;
    createdBy: User;
    priceAndFiles?: PriceAndFiles[];
    totalPrice: number;
    categories?: [];
    demo_url?: string;
    documentation_url?: string;
    video_url?: string;
    status: ProductStatus;
    _id?: string;
    // snippets?: [HighlightResult];
    tags: Tag[];
    support: Support;
    // addedToCart?: boolean;
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
