import { Tag } from './product.model';
import { Company } from './company.model';

export interface User {
    _id?: string;
    email?: string;
    name?: string;
    email_verified?: boolean;
    sub?: string;
    // __typename?: string;
    location?: string;
    stackoverflow_url?: string;
    linkedin_url?: string;
    github_url?: string;
    currentJobDetails?: CurrentJobDetails;
    programming_languages?: string[];
    avatar?: string;
    cover?: string;
    roles?: Roles[];
    stripeId?: string;
    createdAt?: string;
    slug?: string;
    likeCount?: number;
    subscription?: Subscription[];
}

interface Subscription {
    plan?: {
        nickname: string;
        amount: number;
        id: string;
    };
    metadata?: {
        userId: User;
    };
    subscriptionUsers: [User];
    quantity: number;
    id: string;
    _id: string;
    status: string;
}


enum Roles {
    Developer,
    Admin,
    User
}

interface CurrentJobDetails {
    jobProfile?: Tag [];
    company?: Company;
    // companyLocation?: string;
}
