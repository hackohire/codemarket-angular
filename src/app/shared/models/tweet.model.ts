export interface Tweet{
    id?: string;
    createdBy?: [{
        name: string;
        _id: string
    }];
    type?: string;
}