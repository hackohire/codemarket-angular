import { User } from './user.model';
import { HighlightResult } from 'ngx-highlightjs';
import { BlockToolData } from '@editorjs/editorjs';
import { PostStatus } from './poststatus.enum';

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
    // addedToCart?: boolean;
}
