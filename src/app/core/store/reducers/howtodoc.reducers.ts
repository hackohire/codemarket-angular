import { initialHowtodocState, HowtodocState } from '../state/howtodoc.state';
import { HowtodocAddedSuccessfully, HowtodocList, SetSelectedHowtodoc, SetAllHowtodocsList } from '../actions/howtodoc.actions';
import { on, createReducer, Action } from '@ngrx/store';


export const howtodocReducers = createReducer(
    initialHowtodocState,
    on(HowtodocAddedSuccessfully, (state, {howtodoc}) => ({
        ...state,
        selectedHowtodoc: howtodoc
    })),


    on(HowtodocList, (state, {howtodoc}) => ({
        ...state,
        howtodocs: howtodoc
    })),
    on(SetSelectedHowtodoc, (state, {howtodoc}) => ({
        ...state,
        selectedHowtodoc: howtodoc
    })),
    on(SetAllHowtodocsList, (state, {howtodoc}) => ({
        ...state,
        allHowtodocs: howtodoc
    })),
);

export function reducer(state: HowtodocState | undefined, action: Action) {
    return howtodocReducers(state, action);
}
