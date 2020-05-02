
import { User } from './user.model';
import { Company } from './company.model';

export interface Email {
    to?: [string];
    cc?: [string];
    bcc?: [string];
    subject?: string;
    company?: Company;
    dateRange?: [string];
    description?: [{
        type?: string;
        data?: any
    }];
    descriptionHTML?: string;
    type?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
}
