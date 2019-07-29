import { EUserActions } from '../actions/user.actions';
import { initialHelpState, HelpState } from '../state/help.state';
import { EHelpActions, HelpActions } from '../actions/help.actions';

export function helpReducers(
    state = initialHelpState,
    action: HelpActions
): HelpState {
    switch (action.type) {
        case EHelpActions.QueryAddedSuccessfully:
            return {
                ...state,
                selectedQuery: action.query
            };
        default:
            return state;
    }
}

