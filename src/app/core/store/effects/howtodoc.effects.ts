import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom} from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { AddHowtodoc, HowtodocAddedSuccessfully, GetHowtodocsByUserId, HowtodocList, GetHowtodocById, SetSelectedHowtodoc, GetAllHowtodocs, SetAllHowtodocsList, UpdateHowtodoc, HowtodocUpdated, DeleteHowtodoc } from '../actions/howtodoc.actions';
import { HowtodocService } from 'src/app/howtodoc/howtodoc.service';
import { Howtodoc } from 'src/app/shared/models/howtodoc.model';
import { selectHowtodocsList } from '../selectors/howtodoc.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';

@Injectable()
export class HowtodocEffects {

    @Effect()
    addHowtodoc$ = this.actions$.pipe(
        ofType(AddHowtodoc),
        map(action => action.howtodoc),
        switchMap((howtodoc) => this.howtodocService.addHowtodoc(howtodoc)),
        map((howtodoc: Howtodoc) => {

            if (howtodoc && howtodoc.status === PostStatus.Drafted) {
                this.sweetAlertService.success('How-To-Guide has been Drafted Successfully', '', 'success');
            }

            if (howtodoc && howtodoc.status === PostStatus.Published) {
                this.sweetAlertService.success('How-To-Guide has been Published Successfully', '', 'success');
            }

            this.howtodocService.redirectToHowtodocDetails(howtodoc);
            return HowtodocAddedSuccessfully({howtodoc});
        }),
    );

    @Effect()
    getHowtodocsByUserId$ = this.actions$.pipe(
        ofType(GetHowtodocsByUserId),
        switchMap((value) => this.howtodocService.getHowtodocsByUserId(value.userId, value.status)),
        tap(u => console.log(u)),
        map((howtodoc: Howtodoc[]) => {
            console.log(howtodoc);
            return HowtodocList({howtodoc});
        })
    );

    @Effect()
    getHowtodocById$ = this.actions$.pipe(
        ofType(GetHowtodocById),
        map(action => action.howtodocId),
        switchMap((howtodocId) => this.howtodocService.getHowtodocById(howtodocId)),
        tap(u => console.log(u)),
        map((howtodoc: Howtodoc) => {
            console.log(howtodoc);
            return SetSelectedHowtodoc({howtodoc});
        })
    );


    @Effect()
    getAllHowtodocsList$ = this.actions$.pipe(
        ofType(GetAllHowtodocs),
        switchMap(() => this.howtodocService.getAllHowtodocs()),
        tap(u => console.log(u)),
        map((howtodoc: Howtodoc[]) => {
            console.log(howtodoc);
            return SetAllHowtodocsList({howtodoc});
        })
    );

    @Effect()
    updateHowtodoc$ = this.actions$.pipe(
        ofType(UpdateHowtodoc),
        map(action => action.howtodoc),
        switchMap((howtodoc) => this.howtodocService.updateHowtodoc(howtodoc)),
        tap(u => console.log(u)),
        map((howtodoc: Howtodoc) => {
  
            if (howtodoc && howtodoc.status === PostStatus.Published) {
                this.sweetAlertService.success('How-To-Guide changes has been Published Successfully', '', 'success');
            }
    
            if (howtodoc && howtodoc.status === PostStatus.Unpublished) {
                this.sweetAlertService.success('How-To-Guide changes has been Unpublished Successfully', '', 'success');
            }
            
            this.howtodocService.redirectToHowtodocDetails(howtodoc);
            return HowtodocUpdated({howtodoc});
        })
    );


    @Effect()
    deleteHowtodoc$ = this.actions$.pipe(
        ofType(DeleteHowtodoc),
        map(action => action.howtodocId),
        switchMap((howtodocId: string) => {
            return this.howtodocService.deleteHowtodoc(howtodocId).pipe(
                withLatestFrom(this.store.select(selectHowtodocsList)),
                map(([isDeleted, howtodocs]) => {
                    if (isDeleted && howtodocs && howtodocs.length) {
                        let deletedHowtodocIndex = -1;
                        deletedHowtodocIndex = howtodocs.findIndex((p) => p._id === howtodocId);
                        if (deletedHowtodocIndex > -1) {
                            howtodocs.splice(deletedHowtodocIndex, 1);
                        }
                    }
                    return [...howtodocs];
                })
            );
        }),
        map((howtodoc: Howtodoc[]) => {
            return HowtodocList({howtodoc});
        }),
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private howtodocService: HowtodocService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
