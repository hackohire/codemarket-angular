import { Action, createAction, props } from '@ngrx/store';
import { HelpQuery } from 'src/app/shared/models/help-query.model';

export enum EHelpActions {
    AddQuery = '[Help] Add Query',
    QueryAddedSuccessfully = '[Help] Query Added Successfully',
}

export const AddQuery = createAction(
    EHelpActions.AddQuery,
    props<{query: HelpQuery}>()
);

export const QueryAddedSuccessfully = createAction(
    EHelpActions.QueryAddedSuccessfully,
    props<{query: HelpQuery}>()
);

