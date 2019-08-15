import { initialInterviewState, InterviewState } from '../state/interview.state';
import { InterviewAddedSuccessfully } from '../actions/interview.actions';
import { on, createReducer, Action } from '@ngrx/store';


export const interviewReducers = createReducer(
    initialInterviewState,
    on(InterviewAddedSuccessfully, (state, {interview}) => ({
        ...state,
        selectedInterview: interview
    }))
);

export function reducer(state: InterviewState | undefined, action: Action) {
    return interviewReducers(state, action);
}
