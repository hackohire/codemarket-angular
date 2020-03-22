import { User } from './user.model';
import { BlockToolData } from '@editorjs/editorjs';
import { Tag } from './product.model';
import { PostStatus } from './poststatus.enum';
import { City } from './city.model';
import { Company } from './company.model';
import { Comment } from './comment.model';
import { Event } from './event.model';

interface Support {
    time: number;
    description: {
        type: string;
        data: BlockToolData
    };
}

export interface Post {
    name?: string;
    description?: [{
        type: string;
        data: BlockToolData
    }];
    type?: string;
    price?: number;
    _id?: string;
    status?: PostStatus;
    createdBy?: User;
    createdAt?: string;
    updatedAt?: string;
    slug?: string;
    referencePostUrl?: string;
    tags?: Tag[];
    support?: Support;
    cover?: string;
    usersAttending?: [User]; /** Only for events */

    /** FOr posts created under user's profile */
    isPostUnderUser?: boolean;
    connectedWithUser?: User & string;

    cities?: City[];
    company?: Company & string;
    isPostUnderCompany?: boolean;
    companies?: [Company & string];
    salaryCurrency?: string;
    salaryRangeFrom?: number;
    salaryRangeTo?: number;
    jobProfile?: [Tag];
    timeline?: number;

    /** Fields related to Career Coach */
    gapAnalysis?: boolean;
    careerCoachSessions?: boolean;
    helpingWithMockInterviews?: boolean;
    hiringMentoringSessions?: boolean;

    /** Fields related to Business Coach */
    businessCoachSessions?: boolean;
    businessAreas?: [Tag];
    businessGoals?: [Tag];
    businessChallenges?: [Tag];
    sellProducts?: {
        sellProducts?: boolean,
        products?: [Tag]
    };
    sellServices?: {
        sellServices: boolean,
        services?: [Tag]
    };

    /** Fields related to Capital Funding */
    fundingDate?: string;
    fundingCurrency?: string;
    fundingAmount?: string;
    fundingBy?: [Company & string];
    fundingTo?: [Company & string];
    fundingProcess?: [[{
        type: string;
        data: BlockToolData
    }]];

    /** Field related to hiring process */
    hiringProcess?: [[{
        type: string;
        data: BlockToolData
    }]];

    likeCount?: number;
    comments?: Comment[];
    connectedEvent?: Event | string;

    /** Field for collaborator */
    collaborators?: [User];
    assignees?: [User];
}
