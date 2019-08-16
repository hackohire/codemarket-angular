import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, tap} from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { AddRequirement, RequirementAddedSuccessfully, GetRequirementsByUserId, RequirementList, GetRequirementById, SetSelectedRequirement, GetAllRequirements, SetAllRequirementsList } from '../actions/requirement.actions';
import { RequirementService } from 'src/app/requirements/requirement.service';
import { Requirement } from 'src/app/shared/models/requirement.model';

@Injectable()
export class RequirementEffects {

    @Effect()
    addRequirement$ = this.actions$.pipe(
        ofType(AddRequirement),
        map(action => action.requirement),
        switchMap((requirement) => this.requirementService.addRequirement(requirement)),
        map((requirement: Requirement) => {
            this.sweetAlertService.success('Requirement Added Successfully', '', 'success');
            return RequirementAddedSuccessfully({requirement});
        }),
    );


    @Effect()
    getRequirementsByUserId$ = this.actions$.pipe(
        ofType(GetRequirementsByUserId),
        switchMap(() => this.requirementService.getRequirementsByUserId()),
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

    constructor(
        private actions$: Actions,
        private requirementService: RequirementService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
