import { User } from './user.model';

import { Tag } from './product.model';
import { PostStatus } from './poststatus.enum';
import { Company } from './company.model';

interface Support {
    time: number;
    description: {
        type: string;
        data: any
    };
}
export interface Goal {
    name?: string;
    description?: [{
        type: string;
        data: any
    }];
    type?: string;
    price?: number;
    _id?: string;
    status?: PostStatus;
    createdBy?: User;
    company?: Company;
    createdAt?: string;
    updatedAt?: string;
    categories?: [];
    tags?: Tag[];
    support?: Support;
}
