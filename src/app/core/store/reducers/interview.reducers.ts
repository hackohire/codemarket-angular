import { initialInterviewState, InterviewState } from '../state/interview.state';
import { InterviewAddedSuccessfully, InterviewList, SetSelectedInterview, SetAllInterviewsList } from '../actions/interview.actions';
import { on, createReducer, Action } from '@ngrx/store';


export const interviewReducers = createReducer(
    initialInterviewState,
    on(InterviewAddedSuccessfully, (state, {interview}) => ({
        ...state,
        selectedInterview: interview
    })),


    on(InterviewList, (state, {interview}) => ({
        ...state,
        interviews: interview
    })),
    on(SetSelectedInterview, (state, {interview}) => ({
        ...state,
        selectedInterview: interview
    })),
    on(SetAllInterviewsList, (state, {interview}) => ({
        ...state,
        allInterviews: interview
    })),
);

export function reducer(state: InterviewState | undefined, action: Action) {
    return interviewReducers(state, action);
}
