import { initialRequirementState, RequirementState } from '../state/requirement.state';
import { RequirementAddedSuccessfully, RequirementList, SetSelectedRequirement, SetAllRequirementsList } from '../actions/requirement.actions';
import { createReducer, on, Action } from '@ngrx/store';


export const requirementReducers = createReducer(
    initialRequirementState,
    on(RequirementAddedSuccessfully, (state, { requirement }) => ({
        ...state,
        selectedRequirement: requirement
    })
    ),

    on(RequirementList, (state, {requirement}) => ({
        ...state,
        requirements: requirement
    })),
    on(SetSelectedRequirement, (state, {requirement}) => ({
        ...state,
        selectedRequirement: requirement
    })),
    on(SetAllRequirementsList, (state, {requirement}) => ({
        ...state,
        allRequirements: requirement
    })),
);

export function reducer(state: RequirementState | undefined, action: Action) {
    return requirementReducers(state, action);
}

