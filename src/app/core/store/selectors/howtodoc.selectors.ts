import { AppState } from '../state/app.state';
import { createSelector, select } from '@ngrx/store';
import { HowtodocState } from '../state/howtodoc.state';

const selectHowtodocs = (state: AppState) => state.howtodoc;

export const selectHowtodocsList = createSelector(
    selectHowtodocs,
    (state: HowtodocState) => state.howtodocs
);

export const selectAllHowtodocsList = createSelector(
    selectHowtodocs,
    (state: HowtodocState) => state.allHowtodocs
);

export const selectSelectedHowtodoc = createSelector(
    selectHowtodocs,
    (state: HowtodocState) => state.selectedHowtodoc
);
