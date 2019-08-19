import { User } from './user.model';
import { BlockToolData } from '@editorjs/editorjs';
import { Tag } from './product.model';

interface Files {
    file: string;
    fileName: string;
}
export interface Interview {
    name: string;
    description: [{
        type: string;
        data: BlockToolData
    }];
    price: number;
    _id?: string;
    status: InterviewStatus;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    categories?: [];
    demo_url?: string;
    // documentation_url?: string;
    // video_url?: string;
    // snippets?: [HighlightResult];
    shortDescription?: string;
    tags: Tag[];
    // files: [Files];
}

export enum InterviewStatus {
    Created = 'Created',
    Submitted = 'Submitted',
    Approved = 'Approved',
    Rejected = 'Rejected',
    Archieved = 'Archieved',
    Deleted = 'Deleted',
    Published = 'Published',
    Unpublished = 'Unpublished',
    Resolved = 'Resolved'
}
