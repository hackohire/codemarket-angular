import { RouterReducerState } from '@ngrx/router-store';
import { UserState } from './user.state';

export interface AppState {
    router?: RouterReducerState;
    users: UserState;
}

export const initialAppState: AppState = {
    users: null,
};

export function getInitialAppState(): AppState {
    return initialAppState;
}

