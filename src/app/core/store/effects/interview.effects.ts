import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom} from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { AddInterview, InterviewAddedSuccessfully, GetInterviewsByUserId, InterviewList, GetInterviewById, SetSelectedInterview, GetAllInterviews, SetAllInterviewsList, UpdateInterview, InterviewUpdated, DeleteInterview } from '../actions/interview.actions';
import { InterviewService } from 'src/app/interview/interview.service';
import { Interview } from 'src/app/shared/models/interview.model';
import { selectInterviewsList } from '../selectors/interview.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';

@Injectable()
export class InterviewEffects {

    @Effect()
    addInterview$ = this.actions$.pipe(
        ofType(AddInterview),
        map(action => action.interview),
        switchMap((interview) => this.interviewService.addInterview(interview)),
        map((interview: Interview) => {

            if (interview && interview.status === PostStatus.Drafted) {
                this.sweetAlertService.success('Interview has been Drafted Successfully', '', 'success');
            }

            if (interview && interview.status === PostStatus.Published) {
                this.sweetAlertService.success('Interview has been Published Successfully', '', 'success');
            }

            this.interviewService.redirectToInterviewDetails(interview);
            return InterviewAddedSuccessfully({interview});
        }),
    );

    @Effect()
    getInterviewsByUserId$ = this.actions$.pipe(
        ofType(GetInterviewsByUserId),
        switchMap((value) => this.interviewService.getInterviewsByUserId(value.userId, value.status)),
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

    @Effect()
    updateInterview$ = this.actions$.pipe(
        ofType(UpdateInterview),
        map(action => action.interview),
        switchMap((interview) => this.interviewService.updateInterview(interview)),
        tap(u => console.log(u)),
        map((interview: Interview) => {
            console.log(interview);

            if (interview && interview.status === PostStatus.Published) {
                this.sweetAlertService.success('Interview changes has been Published Successfully', '', 'success');
            }
    
            if (interview && interview.status === PostStatus.Unpublished) {
                this.sweetAlertService.success('Interview changes has been Unpublished Successfully', '', 'success');
            }

            this.interviewService.redirectToInterviewDetails(interview);
            return InterviewUpdated({interview});
        })
    );


    @Effect()
    deleteInterview$ = this.actions$.pipe(
        ofType(DeleteInterview),
        map(action => action.interviewId),
        switchMap((interviewId: string) => {
            return this.interviewService.deleteInterview(interviewId).pipe(
                withLatestFrom(this.store.select(selectInterviewsList)),
                map(([isDeleted, interviews]) => {
                    if (isDeleted && interviews && interviews.length) {
                        let deletedInterviewIndex = -1;
                        deletedInterviewIndex = interviews.findIndex((p) => p._id === interviewId);
                        if (deletedInterviewIndex > -1) {
                            interviews.splice(deletedInterviewIndex, 1);
                        }
                    }
                    return [...interviews];
                })
            );
        }),
        map((interview: Interview[]) => {
            return InterviewList({interview});
        }),
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private interviewService: InterviewService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
