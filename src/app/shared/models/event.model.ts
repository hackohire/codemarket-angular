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
interface Location {
    longitude: number;
    latitude: number;
    address: string;
    additionalLocationDetails: string;
}

export enum EventTypes {
    Hackathon = 'hackathon',
    Dreamjob = 'dreamjob',
    InterviewWorkshop = 'interview-workshop',
    MockInterview = 'mock-interview',
    Business = 'business',
}

export interface Event {
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
    dateRange?: string[];
    eventType?: EventTypes;
    address?: string;
    location?: Location,
    membershipRequired: boolean,
    company: Company,
}
