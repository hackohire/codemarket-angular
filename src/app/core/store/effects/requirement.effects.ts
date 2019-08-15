import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map} from 'rxjs/operators/';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { AddRequirement, RequirementAddedSuccessfully } from '../actions/requirement.actions';
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

    constructor(
        private actions$: Actions,
        private requirementService: RequirementService,
        private sweetAlertService: SweetalertService
    ) {

    }
}
