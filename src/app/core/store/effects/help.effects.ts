import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap} from 'rxjs/operators/';
import { HelpService } from 'src/app/help/help.service';
import { AddQuery, QueryAddedSuccessfully, GetHelpRequestsByUserId, HelpRequestList, GetHelpRequestById, SetSelectedHelpRequest, GetAllHelpRequests, SetAllHelpRequestsList } from '../actions/help.actions';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';

@Injectable()
export class HelpEffects {

    @Effect()
    addQuery$ = this.actions$.pipe(
        ofType(AddQuery),
        map(action => action.query),
        switchMap((query) => this.helpService.addQuery(query)),
        map((query: HelpQuery) => {
            this.sweetAlertService.success('Help Request Added Successfully', '', 'success');
            return QueryAddedSuccessfully({query});
        }),
    );


    @Effect()
    getHelpRequestsByUserId$ = this.actions$.pipe(
        ofType(GetHelpRequestsByUserId),
        switchMap(() => this.helpService.getHelpRequestsByUserId()),
        tap(u => console.log(u)),
        map((helpRequest: HelpQuery[]) => {
            console.log(helpRequest);
            return HelpRequestList({helpRequest});
        })
    );

    @Effect()
    getHelpRequestById$ = this.actions$.pipe(
        ofType(GetHelpRequestById),
        map(action => action.helpRequestId),
        switchMap((helpRequestId) => this.helpService.getHelpRequestById(helpRequestId)),
        tap(u => console.log(u)),
        map((helpRequest: HelpQuery) => {
            console.log(helpRequest);
            return SetSelectedHelpRequest({helpRequest});
        })
    );


    @Effect()
    getAllHelpRequestsList$ = this.actions$.pipe(
        ofType(GetAllHelpRequests),
        switchMap(() => this.helpService.getAllHelpRequests()),
        tap(u => console.log(u)),
        map((helpRequest: HelpQuery[]) => {
            // console.log(helpRequest);
            return SetAllHelpRequestsList({helpRequest});
        })
    );



    constructor(
        private actions$: Actions,
        private helpService: HelpService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
