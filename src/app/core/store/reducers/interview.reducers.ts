import { initialInterviewState, InterviewState } from '../state/interview.state';
import { EHelpActions } from '../actions/help.actions';
import { InterviewActions, EInterviewActions } from '../actions/interview.actions';


export function interviewReducers(
    state = initialInterviewState,
    action: InterviewActions
): InterviewState {
    switch (action.type) {
        case EInterviewActions.InterviewAddedSuccessfully:
            return {
                ...state,
                selectedInterview: action.interview
            };
        default:
            return state;
    }
}

