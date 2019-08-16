import { AppState } from '../state/app.state';
import { createSelector, select } from '@ngrx/store';
import { InterviewState } from '../state/interview.state';

const selectInterviews = (state: AppState) => state.interview;

export const selectInterviewsList = createSelector(
    selectInterviews,
    (state: InterviewState) => state.interviews
);

export const selectAllInterviewsList = createSelector(
    selectInterviews,
    (state: InterviewState) => state.allInterviews
);

export const selectSelectedInterview = createSelector(
    selectInterviews,
    (state: InterviewState) => state.selectedInterview
);
