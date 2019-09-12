import { AppState } from '../state/app.state';
import { createSelector, select } from '@ngrx/store';
import { DesignState } from '../state/design.state';

const selectDesigns = (state: AppState) => state.design;

export const selectDesignsList = createSelector(
    selectDesigns,
    (state: DesignState) => state.designs
);

export const selectAllDesignsList = createSelector(
    selectDesigns,
    (state: DesignState) => state.allDesigns
);

export const selectSelectedDesign = createSelector(
    selectDesigns,
    (state: DesignState) => state.selectedDesign
);
