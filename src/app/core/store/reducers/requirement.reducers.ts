import { initialRequirementState, RequirementState } from '../state/requirement.state';
import { RequirementAddedSuccessfully } from '../actions/requirement.actions';
import { createReducer, on, Action } from '@ngrx/store';


export const requirementReducers = createReducer(
    initialRequirementState,
    on(RequirementAddedSuccessfully, (state, { requirement }) => ({
        ...state,
        selectedRequirement: requirement
    })
    )
);

export function reducer(state: RequirementState | undefined, action: Action) {
    return requirementReducers(state, action);
}

