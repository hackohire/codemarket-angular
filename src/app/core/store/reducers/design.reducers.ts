import { initialDesignState, DesignState } from '../state/design.state';
import { DesignAddedSuccessfully, DesignList, SetSelectedDesign, SetAllDesignsList } from '../actions/design.actions';
import { on, createReducer, Action } from '@ngrx/store';


export const designReducers = createReducer(
    initialDesignState,
    on(DesignAddedSuccessfully, (state, {design}) => ({
        ...state,
        selectedDesign: design
    })),


    on(DesignList, (state, {design}) => ({
        ...state,
        designs: design
    })),
    on(SetSelectedDesign, (state, {design}) => ({
        ...state,
        selectedDesign: design
    })),
    on(SetAllDesignsList, (state, {design}) => ({
        ...state,
        allDesigns: design
    })),
);

export function reducer(state: DesignState | undefined, action: Action) {
    return designReducers(state, action);
}
