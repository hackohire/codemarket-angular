import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom} from 'rxjs/operators/';
import { HelpService } from 'src/app/help/help.service';
import { AddQuery, QueryAddedSuccessfully, GetHelpRequestsByUserId, HelpRequestList, GetHelpRequestById, SetSelectedHelpRequest, GetAllHelpRequests, SetAllHelpRequestsList, DeleteHelpRequest, HelpRequestUpdated, UpdateHelpRequest } from '../actions/help.actions';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { selectQueries } from '../selectors/help.selectors';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';

@Injectable()
export class HelpEffects {

    @Effect()
    addQuery$ = this.actions$.pipe(
        ofType(AddQuery),
        map(action => action.helpRequest),
        switchMap((helpRequest) => this.helpService.addQuery(helpRequest)),
        map((helpRequest: HelpQuery) => {

            if (helpRequest && helpRequest.status === PostStatus.Drafted) {
                this.sweetAlertService.success('Help Request has been Drafted Successfully', '', 'success');
            }

            if (helpRequest && helpRequest.status === PostStatus.Published) {
                this.sweetAlertService.success('Help Request has been Published Successfully', '', 'success');
            }

            this.helpService.redirectToHelpRequestDetails(helpRequest);
            return QueryAddedSuccessfully({helpRequest});
        }),
    );


    @Effect()
    getHelpRequestsByUserId$ = this.actions$.pipe(
        ofType(GetHelpRequestsByUserId),
        switchMap((value) => this.helpService.getHelpRequestsByUserId(value.userId, value.status)),
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

    @Effect()
    updateHelpRequest$ = this.actions$.pipe(
        ofType(UpdateHelpRequest),
        map(action => action.helpRequest),
        switchMap((helpRequest) => this.helpService.updateHelpRequest(helpRequest)),
        tap(u => console.log(u)),
        map((helpRequest: HelpQuery) => {
            console.log(helpRequest);

            
            if (helpRequest && helpRequest.status === PostStatus.Published) {
                this.sweetAlertService.success('Help Request changes has been Published Successfully', '', 'success');
            }
    
            if (helpRequest && helpRequest.status === PostStatus.Unpublished) {
                this.sweetAlertService.success('Help Request changes has been Unpublished Successfully', '', 'success');
            }


            this.helpService.redirectToHelpRequestDetails(helpRequest);
            return HelpRequestUpdated({helpRequest});
        })
    );


    @Effect()
    deleteHelpRequest$ = this.actions$.pipe(
        ofType(DeleteHelpRequest),
        map(action => action.helpRequestId),
        switchMap((helpRequestId: string) => {
            return this.helpService.deleteHelpRequest(helpRequestId).pipe(
                withLatestFrom(this.store.select(selectQueries)),
                map(([isDeleted, helpRequests]) => {
                    if (isDeleted && helpRequests && helpRequests.length) {
                        let deletedHelpRequestIndex = -1;
                        deletedHelpRequestIndex = helpRequests.findIndex((p) => p._id === helpRequestId);
                        if (deletedHelpRequestIndex > -1) {
                            helpRequests.splice(deletedHelpRequestIndex, 1);
                        }
                    }
                    return [...helpRequests];
                })
            );
        }),
        map((helpRequest: HelpQuery[]) => {
            return HelpRequestList({helpRequest});
        }),
    );



    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private helpService: HelpService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
