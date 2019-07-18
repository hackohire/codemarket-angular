import { Action } from '@ngrx/store';
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


export class GetUser implements Action {
    public readonly type = EUserActions.GetUser;
    constructor(public payload: string) {}
}

export class GetUserSuccess implements Action {
    public readonly type = EUserActions.GetUserSuccess;
    constructor(public payload: User) {}
}

export class GetUsers implements Action {
    public readonly type = EUserActions.GetUsers;
}

export class GetUsersSuccess implements Action {
    public readonly type = EUserActions.GetUsersSuccess;
    constructor(public payload: User[]) {}
}

export class CreateUser implements Action {
    public readonly type = EUserActions.CreateUser;
    constructor(public payload: User) {}
}

export class SetLoggedInUser implements Action {
    public readonly type = EUserActions.SetLoggedInUser;
    constructor(public payload: User) {}
}

export class UpdateUser implements Action {
    public readonly type = EUserActions.UpdateUser;
    constructor(public payload: User) {}
}

export class Authorise implements Action {
    public readonly type = EUserActions.Authorise;
    constructor() {}
}

export type UserActions = GetUser | GetUserSuccess | GetUsers | GetUsersSuccess | CreateUser| SetLoggedInUser | UpdateUser;

