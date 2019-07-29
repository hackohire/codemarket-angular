import { Action } from '@ngrx/store';
import { User } from 'src/app/shared/models/user.model';
import { HelpQuery } from 'src/app/shared/models/help-query.model';

export enum EHelpActions {
    AddQuery = '[Help] Add Query',
    QueryAddedSuccessfully = '[Help] Query Added Successfully',
}


export class AddQuery implements Action {
    public readonly type = EHelpActions.AddQuery;
    constructor(public query: HelpQuery) {}
}

export class QueryAddedSuccessfully implements Action {
    public readonly type = EHelpActions.QueryAddedSuccessfully;
    constructor(public query: HelpQuery) {}
}

export type HelpActions = AddQuery | QueryAddedSuccessfully;

