import { createAction, props } from '@ngrx/store';
import { Interview } from 'src/app/shared/models/interview.model';

export enum EInterviewActions {
    AddInterview = '[Interview] Add Interview',
    InterviewAddedSuccessfully = '[Interview] Interview Added Successfully',

    UpdateInterview = '[Interview] Update Interview',
    InterviewUpdated = '[Interview] Interview Updated',
    DeleteInterview = '[Interview] Delete Interview',

    GetAllInterviews = '[Interview] Get All Interviews', // List of All Interviews in the platform
    GetInterviewsByUserId = '[Interview] Get Interviews By User Id',
    GetInterviewById = '[Interview] Get Interview By Id',
    InterviewList = '[Interview] InterviewList', // List of Interviews Created by LoggedIn User

    SetAllInterviewsList = '[Interview] Set All Interviews List', // Set the List of All Interviews within the platform
    SetSelectedInterview = '[Interview] Select Interview'


}

export const AddInterview = createAction(
    EInterviewActions.AddInterview,
    props<{interview: Interview}>()
);

export const InterviewAddedSuccessfully = createAction(
    EInterviewActions.InterviewAddedSuccessfully,
    props<{interview: Interview}>()
);


export const GetInterviewsByUserId = createAction(
    EInterviewActions.GetInterviewsByUserId,
    props<{userId: string, status: string}>()
);

export const GetInterviewById = createAction(
    EInterviewActions.GetInterviewById,
    props<{interviewId: string}>()
);

export const InterviewList = createAction(
    EInterviewActions.InterviewList,
    props<{interview: Interview[]}>()
);

export const SetSelectedInterview = createAction(
    EInterviewActions.SetSelectedInterview,
    props<{interview: Interview}>()
);

export const GetAllInterviews = createAction(
    EInterviewActions.GetAllInterviews
);

export const SetAllInterviewsList = createAction(
    EInterviewActions.SetAllInterviewsList,
    props<{interview: Interview[]}>()
);

export const UpdateInterview = createAction(
    EInterviewActions.UpdateInterview,
    props<{interview: Interview}>()
);

export const InterviewUpdated = createAction(
    EInterviewActions.InterviewUpdated,
    props<{interview: Interview}>()
);

export const DeleteInterview = createAction(
    EInterviewActions.DeleteInterview,
    props<{interviewId: string}>()
);

