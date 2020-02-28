import { User } from '../../../shared/models/user.model';

export interface UserState {
    users: User[];
    selectedUser: User;
    loggedInUser: User;
}

export const initialUserState: UserState = {
    users: null,
    selectedUser: null,
    loggedInUser: null
};

