import { createAction, props } from '@ngrx/store';
import { Post } from 'src/app/shared/models/post.model';

export enum EPostActions {
    AddPost = '[Post] Add Post',
    PostAddedSuccessfully = '[Post] Post Added Successfully',

    UpdatePost = '[Post] Update Post',
    PostUpdated = '[Post] Post Updated',
    DeletePost = '[Post] Delete Post',

    GetPostsByUserIdAndType = '[Post] Get Posts By User Id And Type',
    GetPostById = '[Post] Get Post By Id',
    SetPostsByUserIdAndType = '[Post] Set Posts By User Id And Type', // List of Posts Created by LoggedIn User

    GetPostsByType = '[Post] Get Posts By Type', // List of All Posts by given type in the platform
    SetPostsByType = '[Post] Set Posts By Type', // Set the List of All Posts within the platform
    SetSelectedPost = '[Post] Select Post'


}

export const AddPost = createAction(
    EPostActions.AddPost,
    props<{post: Post}>()
);

export const PostAddedSuccessfully = createAction(
    EPostActions.PostAddedSuccessfully,
    props<{post: Post}>()
);


export const GetPostsByUserIdAndType = createAction(
    EPostActions.GetPostsByUserIdAndType,
    props<{userId: string, status: string, postType: string}>()
);

export const GetPostById = createAction(
    EPostActions.GetPostById,
    props<{postId: string}>()
);

export const SetPostsByUserIdAndType = createAction(
    EPostActions.SetPostsByUserIdAndType,
    props<{post: Post[], total?: number}>()
);

export const SetSelectedPost = createAction(
    EPostActions.SetSelectedPost,
    props<{post: Post}>()
);

export const GetPostsByType = createAction(
    EPostActions.GetPostsByType,
    props<{postType: string}>()
);

export const SetPostsByType = createAction(
    EPostActions.SetPostsByType,
    props<{post: Post[]}>()
);

export const UpdatePost = createAction(
    EPostActions.UpdatePost,
    props<{post: Post}>()
);

export const PostUpdated = createAction(
    EPostActions.PostUpdated,
    props<{post: Post}>()
);

export const DeletePost = createAction(
    EPostActions.DeletePost,
    props<{postId: string}>()
);

