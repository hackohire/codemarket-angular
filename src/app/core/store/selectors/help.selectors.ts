import { AppState } from '../state/app.state';
import { createSelector } from '@ngrx/store';
import { HelpState } from '../state/help.state';

const selectHelpQueries = (state: AppState) => state.queries;

export const selectQueries = createSelector(
    selectHelpQueries,
    (state: HelpState) => state.queries
);

export const selectAllHelpRequestsList = createSelector(
    selectHelpQueries,
    (state: HelpState) => state.allQueries
);

export const selectSelectedQuery = createSelector(
    selectHelpQueries,
    (state: HelpState) => state.selectedQuery
);
