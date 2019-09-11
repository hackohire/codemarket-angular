import { User } from './user.model';
import { BlockToolData } from '@editorjs/editorjs';
import { Tag } from './product.model';

interface Support {
    time: number;
    description: {
        type: string;
        data: BlockToolData
    };
}
export interface Testing {
    name: string;
    description: [{
        type: string;
        data: BlockToolData
    }];
    price: number;
    _id?: string;
    status: TestingStatus;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    categories?: [];
    tags: Tag[];
    support: Support;
}

export enum TestingStatus {
    Created = 'Created',
    Submitted = 'Submitted',
    Drafted = 'Drafted',
    Approved = 'Approved',
    Rejected = 'Rejected',
    Archieved = 'Archieved',
    Deleted = 'Deleted',
    Published = 'Published',
    Unpublished = 'Unpublished',
    Resolved = 'Resolved'
}
