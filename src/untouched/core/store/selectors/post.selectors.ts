import { AppState } from '../state/app.state';
import { createSelector, select } from '@ngrx/store';
import { PostState } from '../state/post.state';

const selectPosts = (state: AppState) => state.post;

export const selectPostsByUserIdAndType = createSelector(
    selectPosts,
    (state: PostState) => state.postsByUserIdAndType
);

export const selectPostsByType = createSelector(
    selectPosts,
    (state: PostState) => state.postsByType
);

export const selectSelectedPost = createSelector(
    selectPosts,
    (state: PostState) => state.selectedPost
);
