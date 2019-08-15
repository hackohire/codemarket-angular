import { createAction, props } from '@ngrx/store';
import { Requirement } from 'src/app/shared/models/requirement.model';

export enum ERequirementActions {
    AddRequirement = '[Requirement] Add Requirement',
    RequirementAddedSuccessfully = '[Requirement] Requirement Added Successfully',
}

export const AddRequirement = createAction(
    ERequirementActions.AddRequirement,
    props<{requirement: Requirement}>()
);

export const RequirementAddedSuccessfully = createAction(
    ERequirementActions.RequirementAddedSuccessfully,
    props<{requirement: Requirement}>()
);


