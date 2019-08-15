import { createAction, props } from '@ngrx/store';
import { Interview } from 'src/app/shared/models/interview.model';

export enum EInterviewActions {
    AddInterview = '[Interview] Add Interview',
    InterviewAddedSuccessfully = '[Interview] Interview Added Successfully',
}

export const AddInterview = createAction(
    EInterviewActions.AddInterview,
    props<{interview: Interview}>()
);

export const InterviewAddedSuccessfully = createAction(
    EInterviewActions.InterviewAddedSuccessfully,
    props<{interview: Interview}>()
);

