import { createAction, props } from '@ngrx/store';
import { Design } from 'src/app/shared/models/design.model';

export enum EDesignActions {
    AddDesign = '[Design] Add Design',
    DesignAddedSuccessfully = '[Design] Design Added Successfully',

    UpdateDesign = '[Design] Update Design',
    DesignUpdated = '[Design] Design Updated',
    DeleteDesign = '[Design] Delete Design',

    GetAllDesigns = '[Design] Get All Designs', // List of All Designs in the platform
    GetDesignsByUserId = '[Design] Get Designs By User Id',
    GetDesignById = '[Design] Get Design By Id',
    DesignList = '[Design] DesignList', // List of Designs Created by LoggedIn User

    SetAllDesignsList = '[Design] Set All Designs List', // Set the List of All Designs within the platform
    SetSelectedDesign = '[Design] Select Design'


}

export const AddDesign = createAction(
    EDesignActions.AddDesign,
    props<{design: Design}>()
);

export const DesignAddedSuccessfully = createAction(
    EDesignActions.DesignAddedSuccessfully,
    props<{design: Design}>()
);


export const GetDesignsByUserId = createAction(
    EDesignActions.GetDesignsByUserId,
    props<{userId: string, status: string}>()
);

export const GetDesignById = createAction(
    EDesignActions.GetDesignById,
    props<{designId: string}>()
);

export const DesignList = createAction(
    EDesignActions.DesignList,
    props<{design: Design[]}>()
);

export const SetSelectedDesign = createAction(
    EDesignActions.SetSelectedDesign,
    props<{design: Design}>()
);

export const GetAllDesigns = createAction(
    EDesignActions.GetAllDesigns
);

export const SetAllDesignsList = createAction(
    EDesignActions.SetAllDesignsList,
    props<{design: Design[]}>()
);

export const UpdateDesign = createAction(
    EDesignActions.UpdateDesign,
    props<{design: Design}>()
);

export const DesignUpdated = createAction(
    EDesignActions.DesignUpdated,
    props<{design: Design}>()
);

export const DeleteDesign = createAction(
    EDesignActions.DeleteDesign,
    props<{designId: string}>()
);

