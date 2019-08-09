import { User } from './user.model';
import { HighlightResult } from 'ngx-highlightjs';

interface Files {
    file: string;
    fileName: string;
}
export interface Requirement {
    name: string;
    description: string;
    price: number;
    _id?: string;
    status: RequirementStatus;
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

export enum RequirementStatus {
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
