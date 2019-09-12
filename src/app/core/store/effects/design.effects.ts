import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom} from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { AddDesign, DesignAddedSuccessfully, GetDesignsByUserId, DesignList, GetDesignById, SetSelectedDesign, GetAllDesigns, SetAllDesignsList, UpdateDesign, DesignUpdated, DeleteDesign } from '../actions/design.actions';
import { DesignService } from 'src/app/design/design.service';
import { Design } from 'src/app/shared/models/design.model';
import { selectDesignsList } from '../selectors/design.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';

@Injectable()
export class DesignEffects {

    @Effect()
    addDesign$ = this.actions$.pipe(
        ofType(AddDesign),
        map(action => action.design),
        switchMap((design) => this.designService.addDesign(design)),
        map((design: Design) => {

            if (design && design.status === PostStatus.Drafted) {
                this.sweetAlertService.success('Design has been Drafted Successfully', '', 'success');
            }

            if (design && design.status === PostStatus.Published) {
                this.sweetAlertService.success('Design has been Published Successfully', '', 'success');
            }

            this.designService.redirectToDesignDetails(design);

            return DesignAddedSuccessfully({design});
        }),
    );

    @Effect()
    getDesignsByUserId$ = this.actions$.pipe(
        ofType(GetDesignsByUserId),
        switchMap((value) => this.designService.getDesignsByUserId(value.userId, value.status)),
        tap(u => console.log(u)),
        map((design: Design[]) => {
            console.log(design);
            return DesignList({design});
        })
    );

    @Effect()
    getDesignById$ = this.actions$.pipe(
        ofType(GetDesignById),
        map(action => action.designId),
        switchMap((designId) => this.designService.getDesignById(designId)),
        tap(u => console.log(u)),
        map((design: Design) => {
            console.log(design);
            return SetSelectedDesign({design});
        })
    );


    @Effect()
    getAllDesignsList$ = this.actions$.pipe(
        ofType(GetAllDesigns),
        switchMap(() => this.designService.getAllDesigns()),
        tap(u => console.log(u)),
        map((design: Design[]) => {
            console.log(design);
            return SetAllDesignsList({design});
        })
    );

    @Effect()
    updateDesign$ = this.actions$.pipe(
        ofType(UpdateDesign),
        map(action => action.design),
        switchMap((design) => this.designService.updateDesign(design)),
        tap(u => console.log(u)),
        map((design: Design) => {
            console.log(design);


            if (design && design.status === PostStatus.Published) {
                this.sweetAlertService.success('Design changes has been Published Successfully', '', 'success');
            }
    
            if (design && design.status === PostStatus.Unpublished) {
                this.sweetAlertService.success('Design changes has been Unpublished Successfully', '', 'success');
            }

            this.designService.redirectToDesignDetails(design);
            return DesignUpdated({design});
        })
    );


    @Effect()
    deleteDesign$ = this.actions$.pipe(
        ofType(DeleteDesign),
        map(action => action.designId),
        switchMap((designId: string) => {
            return this.designService.deleteDesign(designId).pipe(
                withLatestFrom(this.store.select(selectDesignsList)),
                map(([isDeleted, designs]) => {
                    if (isDeleted && designs && designs.length) {
                        let deletedDesignIndex = -1;
                        deletedDesignIndex = designs.findIndex((p) => p._id === designId);
                        if (deletedDesignIndex > -1) {
                            designs.splice(deletedDesignIndex, 1);
                        }
                    }
                    return [...designs];
                })
            );
        }),
        map((design: Design[]) => {
            return DesignList({design});
        }),
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private designService: DesignService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
