import { BlockTool } from '@editorjs/editorjs';
import { User } from './user.model';

export interface Comment {
    _id?: string;
    text?: BlockTool;
    type: string;
    createdAt: string;
    updatedAt: string;
    children: [Comment];
    parentId: string;
    referenceId: string;
    companyReferenceId?: string;
    createdBy: User;
    status: string;

    blockSpecificComment: boolean;
    blockId: string;

    postId: string;
}
