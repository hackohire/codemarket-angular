import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap} from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { AddInterview, InterviewAddedSuccessfully, GetInterviewsByUserId, InterviewList, GetInterviewById, SetSelectedInterview, GetAllInterviews, SetAllInterviewsList } from '../actions/interview.actions';
import { InterviewService } from 'src/app/interview/interview.service';
import { Interview } from 'src/app/shared/models/interview.model';

@Injectable()
export class InterviewEffects {

    @Effect()
    addInterview$ = this.actions$.pipe(
        ofType(AddInterview),
        map(action => action.interview),
        switchMap((interview) => this.interviewService.addInterview(interview)),
        map((interview: Interview) => {
            this.sweetAlertService.success('Interview Added Successfully', '', 'success');
            return InterviewAddedSuccessfully({interview});
        }),
    );

    @Effect()
    getInterviewsByUserId$ = this.actions$.pipe(
        ofType(GetInterviewsByUserId),
        switchMap(() => this.interviewService.getInterviewsByUserId()),
        tap(u => console.log(u)),
        map((interview: Interview[]) => {
            console.log(interview);
            return InterviewList({interview});
        })
    );

    @Effect()
    getInterviewById$ = this.actions$.pipe(
        ofType(GetInterviewById),
        map(action => action.interviewId),
        switchMap((interviewId) => this.interviewService.getInterviewById(interviewId)),
        tap(u => console.log(u)),
        map((interview: Interview) => {
            console.log(interview);
            return SetSelectedInterview({interview});
        })
    );


    @Effect()
    getAllInterviewsList$ = this.actions$.pipe(
        ofType(GetAllInterviews),
        switchMap(() => this.interviewService.getAllInterviews()),
        tap(u => console.log(u)),
        map((interview: Interview[]) => {
            console.log(interview);
            return SetAllInterviewsList({interview});
        })
    );

    constructor(
        private actions$: Actions,
        private interviewService: InterviewService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
