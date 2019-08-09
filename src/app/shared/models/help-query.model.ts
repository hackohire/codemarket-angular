import { User } from './user.model';
import { HighlightResult } from 'ngx-highlightjs';

interface Files {
    file: string;
    fileName: string;
}
export interface HelpQuery {
    question: string;
    description: string;
    price: number;
    _id?: string;
    status: HelpQueryStatus;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    categories?: [];
    demo_url?: string;
    documentation_url?: string;
    video_url?: string;
    snippets?: [HighlightResult];
    shortDescription?: string;
    files: [Files];
}

export enum HelpQueryStatus {
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
