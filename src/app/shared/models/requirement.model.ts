import { User } from './user.model';

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
        data: any
    };
}
export interface Requirement {
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
    createdAt?: string;
    updatedAt?: string;
    categories?: [];
    demo_url?: string;
    company?: Company;
    // documentation_url?: string;
    // video_url?: string;
    // snippets?: [HighlightResult];
    shortDescription?: string;
    tags?: Tag[];
    support?: Support;
    // files: [Files];
}

