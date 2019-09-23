import { Post } from 'src/app/shared/models/post.model';

export interface PostState {
    postsByUserIdAndType: Post[];
    selectedPost: Post;
    postsByType: Post[];
}

export const initialPostState: PostState = {
    postsByUserIdAndType: null,
    selectedPost: null,
    postsByType: null
};

