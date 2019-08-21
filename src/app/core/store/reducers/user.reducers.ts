import { initialUserState, UserState } from '../state/user.state';
import { GetUsersSuccess, GetUserSuccess, SetLoggedInUser } from '../actions/user.actions';
import { createReducer, on, Action } from '@ngrx/store';


export const userReducers = createReducer(
    initialUserState,
    on(GetUsersSuccess, (state, {payload}) => ({
        ...state,
        users: payload
    })),
    on(GetUserSuccess, (state, {payload}) => ({
        ...state,
        selectedUser: payload
    })),
    on(SetLoggedInUser, (state, {payload}) => ({
        ...state,
        loggedInUser: payload
    })),
);

export function reducer(state: UserState | undefined, action: Action) {
    return userReducers(state, action);
}
