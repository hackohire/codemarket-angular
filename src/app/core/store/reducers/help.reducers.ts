import { initialHelpState, HelpState } from '../state/help.state';
import { QueryAddedSuccessfully, HelpRequestList, SetSelectedHelpRequest, SetAllHelpRequestsList } from '../actions/help.actions';
import { createReducer, on, Action } from '@ngrx/store';

export const helpReducers = createReducer(
    initialHelpState,
    on(QueryAddedSuccessfully, (state, {helpRequest}) => ({
        ...state,
        selectedQuery: helpRequest
    })),

    on(HelpRequestList, (state, {helpRequest}) => ({
        ...state,
        queries: helpRequest
    })),
    on(SetSelectedHelpRequest, (state, {helpRequest}) => ({
        ...state,
        selectedQuery: helpRequest
    })),
    on(SetAllHelpRequestsList, (state, {helpRequest}) => ({
        ...state,
        allQueries: helpRequest
    })),
);

export function reducer(state: HelpState | undefined, action: Action) {
    return helpReducers(state, action);
}
