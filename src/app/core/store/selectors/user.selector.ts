import { AppState } from "../state/app.state";
import { createSelector, select } from '@ngrx/store';
import { UserState } from '../state/user.state';

const selectUsers = (state: AppState) => state.users;

export const selectUserList = createSelector(
    selectUsers,
    (state: UserState) => state.users
);

export const selectLoggedInUser = createSelector(
    selectUsers,
    (state: UserState) => state.loggedInUser
);

export const selectSelectedUser = createSelector(
    selectUsers,
    (state: UserState) => state.selectedUser
);
