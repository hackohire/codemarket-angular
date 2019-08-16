import { createAction, props } from '@ngrx/store';
import { Requirement } from 'src/app/shared/models/requirement.model';

export enum ERequirementActions {
    AddRequirement = '[Requirement] Add Requirement',
    RequirementAddedSuccessfully = '[Requirement] Requirement Added Successfully',

    GetAllRequirements = '[Requirement] Get All Requirements', // List of All Requirements in the platform
    GetRequirementsByUserId = '[Requirement] Get Requirements By User Id',
    GetRequirementById = '[Requirement] Get Requirement By Id',
    RequirementList = '[Requirement] RequirementList', // List of Requirements Created by LoggedIn User

    SetAllRequirementsList = '[Requirement] Set All Requirements List', // Set the List of All Requirements within the platform
    SetSelectedRequirement = '[Requirement] Select Requirement'
}

export const AddRequirement = createAction(
    ERequirementActions.AddRequirement,
    props<{requirement: Requirement}>()
);

export const RequirementAddedSuccessfully = createAction(
    ERequirementActions.RequirementAddedSuccessfully,
    props<{requirement: Requirement}>()
);



export const GetRequirementsByUserId = createAction(
    ERequirementActions.GetRequirementsByUserId
);

export const GetRequirementById = createAction(
    ERequirementActions.GetRequirementById,
    props<{requirementId: string}>()
);

export const RequirementList = createAction(
    ERequirementActions.RequirementList,
    props<{requirement: Requirement[]}>()
);

export const SetSelectedRequirement = createAction(
    ERequirementActions.SetSelectedRequirement,
    props<{requirement: Requirement}>()
);

export const GetAllRequirements = createAction(
    ERequirementActions.GetAllRequirements
);

export const SetAllRequirementsList = createAction(
    ERequirementActions.SetAllRequirementsList,
    props<{requirement: Requirement[]}>()
);


