import { AppState } from '../state/app.state';
import { createSelector, select } from '@ngrx/store';
import { TestingState } from '../state/testing.state';

const selectTestings = (state: AppState) => state.testing;

export const selectTestingsList = createSelector(
    selectTestings,
    (state: TestingState) => state.testings
);

export const selectAllTestingsList = createSelector(
    selectTestings,
    (state: TestingState) => state.allTestings
);

export const selectSelectedTesting = createSelector(
    selectTestings,
    (state: TestingState) => state.selectedTesting
);
