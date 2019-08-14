import { Action } from '@ngrx/store';
import { Requirement } from 'src/app/shared/models/requirement.model';

export enum ERequirementActions {
    AddRequirement = '[Requirement] Add Requirement',
    RequirementAddedSuccessfully = '[Requirement] Requirement Added Successfully',
}


export class AddRequirement implements Action {
    public readonly type = ERequirementActions.AddRequirement;
    constructor(public requirement: Requirement) {}
}

export class RequirementAddedSuccessfully implements Action {
    public readonly type = ERequirementActions.RequirementAddedSuccessfully;
    constructor(public requirement: Requirement) {}
}

export type RequirementActions = AddRequirement | RequirementAddedSuccessfully;

