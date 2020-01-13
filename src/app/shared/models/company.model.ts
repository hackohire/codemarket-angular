import { User } from './user.model';
import { BlockToolData } from '@editorjs/editorjs';
import { City } from './city.model';
import { PostStatus } from './poststatus.enum';
import { Comment } from './comment.model';


interface Location {
    longitude: number;
    latitude: number;
    address: string;
    additionalLocationDetails: string;
}

export interface Company {
    name?: string;
    type?: CompanyTypes;
    description?: [{
        type: string;
        data: BlockToolData
    }];
    ideas?: [{
        type: string;
        data: BlockToolData
    }];
    _id?: string;
    status?: PostStatus;
    createdBy?: User;
    createdAt?: string;
    updatedAt?: string;
    cities?: City[];
    location?: Location;
    cover: string;
    posts?: CompanyPost[];
}

export interface CompanyPost {
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    postType?: string;
    challengeType: string;
    description: [{
        type: string;
        data: BlockToolData
    }];
    comments: Comment[];
}

export interface Challenge {
    description?: [{
        type: string;
        data: BlockToolData
    }];
    challengeType: ChallengeTypes
}

export enum CompanyTypes {
    NonProfit = 'non-profit',
    Startup = 'startup',
    LocalBusiness = 'local-business',
    smb = 'smb',
    School = 'school',
    Government = 'government'
}

export enum ChallengeTypes {
    Sales = 'sales',
    Marketing = 'marketing',
    Business = 'business',
    Team = 'team',
    Technical = 'technical'
}
