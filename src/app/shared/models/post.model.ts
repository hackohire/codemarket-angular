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

    cities?: City[];
    companies?: [Company & string];
    salaryCurrency?: string;
    salaryRangeFrom?: number;
    salaryRangeTo?: number;
    jobProfile?: [Tag];
    timeline?: number;

    likeCount?: number;
    comments?: Comment[];

    /** Field for collaborator */
    collaborators?: [User];
    assignees?: [User];

    users?: [User];
}
