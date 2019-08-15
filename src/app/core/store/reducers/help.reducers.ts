import { initialHelpState, HelpState } from '../state/help.state';
import { QueryAddedSuccessfully } from '../actions/help.actions';
import { createReducer, on, Action } from '@ngrx/store';

export const helpReducers = createReducer(
    initialHelpState,
    on(QueryAddedSuccessfully, (state, {query}) => ({
        ...state,
        selectedQuery: query
    }))
);

export function reducer(state: HelpState | undefined, action: Action) {
    return helpReducers(state, action);
}
