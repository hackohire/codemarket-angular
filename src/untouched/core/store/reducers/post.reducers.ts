import { initialPostState, PostState } from '../state/post.state';
import { PostAddedSuccessfully, SetPostsByUserIdAndType, SetSelectedPost, SetPostsByType } from '../actions/post.actions';
import { on, createReducer, Action } from '@ngrx/store';


export const postReducers = createReducer(
    initialPostState,
    on(PostAddedSuccessfully, (state, {post}) => ({
        ...state,
        selectedPost: post
    })),
    on(SetPostsByUserIdAndType, (state, {post, total}) => ({
        ...state,
        postsByUserIdAndType: post,
        total
    })),
    on(SetSelectedPost, (state, {post}) => ({
        ...state,
        selectedPost: post
    })),
    on(SetPostsByType, (state, {post}) => ({
        ...state,
        postsByType: post
    })),
);

export function reducer(state: PostState | undefined, action: Action) {
    return postReducers(state, action);
}
