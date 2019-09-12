import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom} from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { AddTesting, TestingAddedSuccessfully, GetTestingsByUserId, TestingList, GetTestingById, SetSelectedTesting, GetAllTestings, SetAllTestingsList, UpdateTesting, TestingUpdated, DeleteTesting } from '../actions/testing.actions';
import { TestingService } from 'src/app/testing/testing.service';
import { Testing } from 'src/app/shared/models/testing.model';
import { selectTestingsList } from '../selectors/testing.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';

@Injectable()
export class TestingEffects {

    @Effect()
    addTesting$ = this.actions$.pipe(
        ofType(AddTesting),
        map(action => action.testing),
        switchMap((testing) => this.testingService.addTesting(testing)),
        map((testing: Testing) => {

            if (testing && testing.status === PostStatus.Drafted) {
                this.sweetAlertService.success('Testing Report has been Drafted Successfully', '', 'success');
            }

            if (testing && testing.status === PostStatus.Published) {
                this.sweetAlertService.success('Testing Report has been Published Successfully', '', 'success');
            }

            this.testingService.redirectToTestingDetails(testing);

            return TestingAddedSuccessfully({testing});
        }),
    );

    @Effect()
    getTestingsByUserId$ = this.actions$.pipe(
        ofType(GetTestingsByUserId),
        switchMap((value) => this.testingService.getTestingsByUserId(value.userId, value.status)),
        tap(u => console.log(u)),
        map((testing: Testing[]) => {
            console.log(testing);
            return TestingList({testing});
        })
    );

    @Effect()
    getTestingById$ = this.actions$.pipe(
        ofType(GetTestingById),
        map(action => action.testingId),
        switchMap((testingId) => this.testingService.getTestingById(testingId)),
        tap(u => console.log(u)),
        map((testing: Testing) => {
            console.log(testing);
            return SetSelectedTesting({testing});
        })
    );


    @Effect()
    getAllTestingsList$ = this.actions$.pipe(
        ofType(GetAllTestings),
        switchMap(() => this.testingService.getAllTestings()),
        tap(u => console.log(u)),
        map((testing: Testing[]) => {
            console.log(testing);
            return SetAllTestingsList({testing});
        })
    );

    @Effect()
    updateTesting$ = this.actions$.pipe(
        ofType(UpdateTesting),
        map(action => action.testing),
        switchMap((testing) => this.testingService.updateTesting(testing)),
        tap(u => console.log(u)),
        map((testing: Testing) => {
            console.log(testing);


            if (testing && testing.status === PostStatus.Published) {
                this.sweetAlertService.success('Testing Report changes has been Published Successfully', '', 'success');
            }
    
            if (testing && testing.status === PostStatus.Unpublished) {
                this.sweetAlertService.success('Testing Report changes has been Unpublished Successfully', '', 'success');
            }

            this.testingService.redirectToTestingDetails(testing);
            return TestingUpdated({testing});
        })
    );


    @Effect()
    deleteTesting$ = this.actions$.pipe(
        ofType(DeleteTesting),
        map(action => action.testingId),
        switchMap((testingId: string) => {
            return this.testingService.deleteTesting(testingId).pipe(
                withLatestFrom(this.store.select(selectTestingsList)),
                map(([isDeleted, testings]) => {
                    if (isDeleted && testings && testings.length) {
                        let deletedTestingIndex = -1;
                        deletedTestingIndex = testings.findIndex((p) => p._id === testingId);
                        if (deletedTestingIndex > -1) {
                            testings.splice(deletedTestingIndex, 1);
                        }
                    }
                    return [...testings];
                })
            );
        }),
        map((testing: Testing[]) => {
            return TestingList({testing});
        }),
    );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private testingService: TestingService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
