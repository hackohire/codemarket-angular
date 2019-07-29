import { AppState } from '../state/app.state';
import { createSelector, select } from '@ngrx/store';
import { ProductState } from '../state/product.state';
import { HelpState } from '../state/help.state';

const selectHelpQueries = (state: AppState) => state.queries;

export const selectQueries = createSelector(
    selectHelpQueries,
    (state: HelpState) => state.queries
);

export const selectSelectedQuery = createSelector(
    selectHelpQueries,
    (state: HelpState) => state.selectedQuery
);
