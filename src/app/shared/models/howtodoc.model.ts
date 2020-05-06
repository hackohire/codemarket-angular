import { User } from './user.model';

import { Tag } from './product.model';
import { PostStatus } from './poststatus.enum';

interface Support {
    time: number;
    description: {
        type: string;
        data: any
    };
}
export interface Howtodoc {
    name: string;
    description: [{
        type: string;
        data: any
    }];
    type?: string;
    price: number;
    _id?: string;
    status: PostStatus;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    categories?: [];
    tags: Tag[];
    support: Support;
}
