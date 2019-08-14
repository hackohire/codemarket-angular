import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map} from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { EInterviewActions, AddInterview, InterviewAddedSuccessfully } from '../actions/interview.actions';
import { InterviewService } from 'src/app/interview/interview.service';
import { Interview } from 'src/app/shared/models/interview.model';

@Injectable()
export class InterviewEffects {

    @Effect()
    addInterview$ = this.actions$.pipe(
        ofType<AddInterview>(EInterviewActions.AddInterview),
        map(action => action.interview),
        switchMap((interview) => this.interviewService.addInterview(interview)),
        map((interview: Interview) => {
            this.sweetAlertService.success('Interview Added Successfully', '', 'success');
            return new InterviewAddedSuccessfully(interview);
        }),
    );

    constructor(
        private actions$: Actions,
        private interviewService: InterviewService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
