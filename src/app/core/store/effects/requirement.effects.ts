import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap, withLatestFrom} from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { AddRequirement, RequirementAddedSuccessfully, GetRequirementsByUserId, RequirementList, GetRequirementById, SetSelectedRequirement, GetAllRequirements, SetAllRequirementsList, RequirementUpdated, DeleteRequirement, UpdateRequirement } from '../actions/requirement.actions';
import { RequirementService } from 'src/app/requirements/requirement.service';
import { Requirement } from 'src/app/shared/models/requirement.model';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { selectInterviewsList } from '../selectors/interview.selectors';
import { selectRequirementsList } from '../selectors/requirement.selectors';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';

@Injectable()
export class RequirementEffects {

    @Effect()
    addRequirement$ = this.actions$.pipe(
        ofType(AddRequirement),
        map(action => action.requirement),
        switchMap((requirement) => this.requirementService.addRequirement(requirement)),
        map((requirement: Requirement) => {

            if (requirement && requirement.status === PostStatus.Drafted) {
                this.sweetAlertService.success('Requirement has been Drafted Successfully', '', 'success');
            }

            if (requirement && requirement.status === PostStatus.Published) {
                this.sweetAlertService.success('Requirement has been Published Successfully', '', 'success');
            }

            this.requirementService.redirectToRequirementDetails(requirement);
            return RequirementAddedSuccessfully({requirement});
        }),
    );


    @Effect()
    getRequirementsByUserId$ = this.actions$.pipe(
        ofType(GetRequirementsByUserId),
        switchMap((value) => this.requirementService.getRequirementsByUserId(value.userId, value.status)),
        tap(u => console.log(u)),
        map((requirement: Requirement[]) => {
            console.log(requirement);
            return RequirementList({requirement});
        })
    );

    @Effect()
    getRequirementById$ = this.actions$.pipe(
        ofType(GetRequirementById),
        map(action => action.requirementId),
        switchMap((requirementId) => this.requirementService.getRequirementById(requirementId)),
        tap(u => console.log(u)),
        map((requirement: Requirement) => {
            console.log(requirement);
            return SetSelectedRequirement({requirement});
        })
    );


    @Effect()
    getAllRequirementsList$ = this.actions$.pipe(
        ofType(GetAllRequirements),
        switchMap(() => this.requirementService.getAllRequirements()),
        tap(u => console.log(u)),
        map((requirement: Requirement[]) => {
            console.log(requirement);
            return SetAllRequirementsList({requirement});
        })
    );

    @Effect()
    updateRequirement$ = this.actions$.pipe(
        ofType(UpdateRequirement),
        map(action => action.requirement),
        switchMap((requirement) => this.requirementService.updateRequirement(requirement)),
        tap(u => console.log(u)),
        map((requirement: Requirement) => {
            console.log(requirement);

            if (requirement && requirement.status === PostStatus.Published) {
                this.sweetAlertService.success('Requirement changes has been Published Successfully', '', 'success');
            }
    
            if (requirement && requirement.status === PostStatus.Unpublished) {
                this.sweetAlertService.success('Requirement changes has been Unpublished Successfully', '', 'success');
            }


            this.requirementService.redirectToRequirementDetails(requirement);
            return RequirementUpdated({requirement});
        })
    );


    @Effect()
    deleteRequirement$ = this.actions$.pipe(
        ofType(DeleteRequirement),
        map(action => action.requirementId),
        switchMap((requirementId: string) => {
            return this.requirementService.deleteRequirement(requirementId).pipe(
                withLatestFrom(this.store.select(selectRequirementsList)),
                map(([isDeleted, requirements]) => {
                    if (isDeleted && requirements && requirements.length) {
                        let deletedRequirementIndex = -1;
                        deletedRequirementIndex = requirements.findIndex((p) => p._id === requirementId);
                        if (deletedRequirementIndex > -1) {
                            requirements.splice(deletedRequirementIndex, 1);
                        }
                    }
                    return [...requirements];
                })
            );
        }),
        map((requirement: Requirement[]) => {
            return RequirementList({requirement});
        }),
    );


    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private requirementService: RequirementService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
