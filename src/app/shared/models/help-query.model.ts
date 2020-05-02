import { User } from './user.model';
import { HighlightResult } from 'ngx-highlightjs';

import { Tag } from './product.model';
import { PostStatus } from './poststatus.enum';

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

export interface HelpQuery {
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
    demo_url?: string;
    documentation_url?: string;
    video_url?: string;
    snippets?: [HighlightResult];
    shortDescription?: string;
    files?: [Files];
    tags?: Tag[];
    support?: Support;
}
