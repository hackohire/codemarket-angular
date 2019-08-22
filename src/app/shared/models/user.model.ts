export interface User {
    _id?: string;
    email: string;
    name: string;
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
    roles?: Roles[];
}


enum Roles {
    Developer,
    Admin,
    User
}

interface CurrentJobDetails {
    jobProfile?: string;
    companyName?: string;
    companyLocation?: string;
}
