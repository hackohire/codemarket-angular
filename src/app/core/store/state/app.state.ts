// import { RouterReducerState } from '@ngrx/router-store';
import { UserState } from './user.state';
import { PostState } from './post.state';

export interface AppState {
    // router?: RouterReducerState;
    users: UserState;
    post: PostState;
}

export const initialAppState: AppState = {
    users: null,
    post: null
};

export function getInitialAppState(): AppState {
    return initialAppState;
}

