import { Company } from './company.model';
export interface FormData {
    formname?: string;
    jsonstring?: string;
    company?: Company;
    connectedFormStructureId?: string;
}