import { User } from './user.model';
import { BlockToolData } from '@editorjs/editorjs';
import { City } from './city.model';
import { PostStatus } from './poststatus.enum';


export interface Company {
    title: string;
    name: string;
    type: CompanyTypes;
    howCanYouHelp: [{
        type: string;
        data: BlockToolData
    }];
    _id?: string;
    status: PostStatus;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    cities: City[];
}

export enum CompanyTypes {
    NonProfit = 'non-profit',
    Startup = 'startup',
    LocalBusiness = 'local-business'
}
