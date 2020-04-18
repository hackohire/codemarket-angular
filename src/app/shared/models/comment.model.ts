import { BlockTool, BlockToolData } from '@editorjs/editorjs';
import { User } from './user.model';

export interface Comment {
    _id?: string;
    text?: any [];
    type: string;
    createdAt: string;
    updatedAt: string;
    children: [Comment];
    parentId: string;
    referenceId: string;
    companyReferenceId?: string;
    userReferenceId?: string;
    createdBy: User;
    status: string;

    blockSpecificComment: boolean;
    blockId: string;

    postId: string;

    textHTML?: string;
}
