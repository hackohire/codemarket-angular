import { initialRequirementState, RequirementState } from '../state/requirement.state';
import { EHelpActions } from '../actions/help.actions';
import { RequirementActions, ERequirementActions } from '../actions/requirement.actions';


export function requirementReducers(
    state = initialRequirementState,
    action: RequirementActions
): RequirementState {
    switch (action.type) {
        case ERequirementActions.RequirementAddedSuccessfully:
            return {
                ...state,
                selectedRequirement: action.requirement
            };
        default:
            return state;
    }
}

