import { BlockTool } from '@editorjs/editorjs';
import { User } from 'aws-sdk/clients/mq';

export interface Comment {
    _id?: string;
    text?: BlockTool;
    type: string;
    createdAt: string;
    updatedAt: string;
    children: [Comment];
    parentId: string;
    referenceId: string;
    createdBy: User | string;
    status: string;
}
