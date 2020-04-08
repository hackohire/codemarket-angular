import { BlockToolData } from '@editorjs/editorjs';
import { User } from './user.model';
import { Company } from './company.model';

export interface Email {
    to?: string[];
    cc?: string[];
    bcc?: string[];
    subject?: string;
    company?: Company;
    dateRange?: string[];
    description?: [{
        type?: string;
        data?: BlockToolData
    }];
    descriptionHTML?: string;
    type?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
}
