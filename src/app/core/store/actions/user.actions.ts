import { Action, createAction, props } from '@ngrx/store';
import { User } from 'src/app/shared/models/user.model';

export enum EUserActions {
    GetUser = '[User] Get User',
    GetUserSuccess = '[User] Get User Success',
    GetUsers = '[User] Get Users',
    GetUsersSuccess = '[User] Get Users Success',
    CreateUser = '[User] Create User',
    SetLoggedInUser = '[User] Set LoggedInUser',
    UpdateUser = '[User] Update User',

    Authorise = '[User] Authorise User'
}

export const GetUser = createAction(
    EUserActions.GetUser,
    props<{payload: string}>()
);

export const GetUserSuccess = createAction(
    EUserActions.GetUserSuccess,
    props<{payload: User}>()
);

export const GetUsers = createAction(
    EUserActions.GetUsers
);

export const GetUsersSuccess = createAction(
    EUserActions.GetUsersSuccess,
    props<{payload: User[]}>()
);

export const CreateUser = createAction(
    EUserActions.CreateUser,
    props<{payload: User}>()
);

export const SetLoggedInUser = createAction(
    EUserActions.SetLoggedInUser,
    props<{payload: User}>()
);

export const UpdateUser = createAction(
    EUserActions.UpdateUser,
    props<{payload: User}>()
);

export const Authorise = createAction(
    EUserActions.Authorise
);
