import { User } from './user.model';
import { BlockToolData } from '@editorjs/editorjs';
import { Tag } from './product.model';
import { PostStatus } from './poststatus.enum';
import { Company } from './company.model';

interface Files {
    file: string;
    fileName: string;
}

interface Support {
    time: number;
    description: {
        type: string;
        data: BlockToolData
    };
}
export interface Interview {
    name: string;
    description: [{
        type: string;
        data: BlockToolData
    }];
    type?: string;
    price: number;
    _id?: string;
    status: PostStatus;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    categories?: [];
    demo_url?: string;
    shortDescription?: string;
    tags?: Tag[];
    support?: Support;
    jobProfile?: string;
    company?: Company
}
