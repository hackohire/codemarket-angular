import { User } from './user.model';
import { PostStatus } from './poststatus.enum';
import { City } from './city.model';
import { Company } from './company.model';
import { Comment } from './comment.model';

export interface Tag {
    name: string;
    _id?: string;
    campaignId?: string;
}

export interface Mentor {
    topics?: Tag[];
    availabilityDate?: string;
    duration?: [];
}

export interface Job {
    jobProfile?: Tag[];
}

export interface FormJson {
    components?: any[];
}
export interface Post {
    name?: string;
    description?: [{
        type: string;
        data: any
    }];
    descriptionHTML?: string;
    activities?: any[];
    type?: string;
    price?: number;
    _id?: string;
    status?: PostStatus;
    createdBy?: User;
    createdAt?: string;
    updatedAt?: string;
    slug?: string;
    tags?: Tag[];
    cover?: string;

    cities?: City[];
    companies?: [Company & string];

    comments?: Comment[];
    commentCount?: number;

    /** Array of ID of posts, a post is tied to */
    connectedPosts?: Post[];

    /** Field for collaborator */
    collaborators?: [User];
    clients?: [User];

    users?: [User];

    /** Contact Related Fields */
    phone?: [string];
    email?: [string];
    birthDate?: string;
    address?: string;
    website?: string;

    appointment_date?: [string];
    cancelReason?: [string];

    mentor?: Mentor;
    job?: Job;
    formStructureJSON?: FormJson
}
