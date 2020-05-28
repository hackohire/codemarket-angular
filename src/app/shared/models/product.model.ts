import { User } from './user.model';
import { HighlightResult } from 'ngx-highlightjs';

import { PostStatus } from './poststatus.enum';

export interface PriceAndFiles {
    fileName: string;
    file: string;
    price: number;
}

export interface Tag {
    name: string;
    _id?: string;
    campaignId?: string;
}

interface Support {
    time: number;
    description: {
        type: string;
        data: any
    };
}



export interface Product {
    name: string;
    description: [{
        type: string;
        data: any
    }];
    type?: string;
    shortDescription?: string;
    featuredImage?: string;
    createdBy: User;
    priceAndFiles?: PriceAndFiles[];
    price: number;
    categories?: [];
    demo_url?: string;
    documentation_url?: string;
    video_url?: string;
    status: PostStatus;
    _id?: string;
    // snippets?: [HighlightResult];
    tags: Tag[];
    support: Support;
    purchasedBy?: User [];
    collaborators: any ;
    // addedToCart?: boolean;
}
