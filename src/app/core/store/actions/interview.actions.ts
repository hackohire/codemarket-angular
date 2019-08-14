import { Action } from '@ngrx/store';
import { Interview } from 'src/app/shared/models/interview.model';

export enum EInterviewActions {
    AddInterview = '[Interview] Add Interview',
    InterviewAddedSuccessfully = '[Interview] Interview Added Successfully',
}


export class AddInterview implements Action {
    public readonly type = EInterviewActions.AddInterview;
    constructor(public interview: Interview) {}
}

export class InterviewAddedSuccessfully implements Action {
    public readonly type = EInterviewActions.InterviewAddedSuccessfully;
    constructor(public interview: Interview) {}
}

export type InterviewActions = AddInterview | InterviewAddedSuccessfully;

