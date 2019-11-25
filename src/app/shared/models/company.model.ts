import { User } from './user.model';
import { BlockToolData } from '@editorjs/editorjs';
import { City } from './city.model';
import { PostStatus } from './poststatus.enum';


interface Location {
    longitude: number;
    latitude: number;
    address: string;
    additionalLocationDetails: string;
}

export interface Company {
    name: string;
    type: CompanyTypes;
    description: [{
        type: string;
        data: BlockToolData
    }];
    ideas: [{
        type: string;
        data: BlockToolData
    }];
    _id?: string;
    status: PostStatus;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
    cities: City[];
    location?: Location
}

export enum CompanyTypes {
    NonProfit = 'non-profit',
    Startup = 'startup',
    LocalBusiness = 'local-business',
    smb = 'smb',
    School = 'school',
    Government = 'government'
}
