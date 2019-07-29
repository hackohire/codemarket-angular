import { User } from './user.model';

export interface HelpQuery {
    question: string;
    description: string;
    price: number;
    _id?: string;
    status: HelpQueryStatus;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
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
