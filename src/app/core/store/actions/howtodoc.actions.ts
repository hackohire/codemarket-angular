import { createAction, props } from '@ngrx/store';
import { Howtodoc } from 'src/app/shared/models/howtodoc.model';

export enum EHowtodocActions {
    AddHowtodoc = '[Howtodoc] Add Howtodoc',
    HowtodocAddedSuccessfully = '[Howtodoc] Howtodoc Added Successfully',

    UpdateHowtodoc = '[Howtodoc] Update Howtodoc',
    HowtodocUpdated = '[Howtodoc] Howtodoc Updated',
    DeleteHowtodoc = '[Howtodoc] Delete Howtodoc',

    GetAllHowtodocs = '[Howtodoc] Get All Howtodocs', // List of All Howtodocs in the platform
    GetHowtodocsByUserId = '[Howtodoc] Get Howtodocs By User Id',
    GetHowtodocById = '[Howtodoc] Get Howtodoc By Id',
    HowtodocList = '[Howtodoc] HowtodocList', // List of Howtodocs Created by LoggedIn User

    SetAllHowtodocsList = '[Howtodoc] Set All Howtodocs List', // Set the List of All Howtodocs within the platform
    SetSelectedHowtodoc = '[Howtodoc] Select Howtodoc'


}

export const AddHowtodoc = createAction(
    EHowtodocActions.AddHowtodoc,
    props<{howtodoc: Howtodoc}>()
);

export const HowtodocAddedSuccessfully = createAction(
    EHowtodocActions.HowtodocAddedSuccessfully,
    props<{howtodoc: Howtodoc}>()
);


export const GetHowtodocsByUserId = createAction(
    EHowtodocActions.GetHowtodocsByUserId,
    props<{userId: string, status: string}>()
);

export const GetHowtodocById = createAction(
    EHowtodocActions.GetHowtodocById,
    props<{howtodocId: string}>()
);

export const HowtodocList = createAction(
    EHowtodocActions.HowtodocList,
    props<{howtodoc: Howtodoc[]}>()
);

export const SetSelectedHowtodoc = createAction(
    EHowtodocActions.SetSelectedHowtodoc,
    props<{howtodoc: Howtodoc}>()
);

export const GetAllHowtodocs = createAction(
    EHowtodocActions.GetAllHowtodocs
);

export const SetAllHowtodocsList = createAction(
    EHowtodocActions.SetAllHowtodocsList,
    props<{howtodoc: Howtodoc[]}>()
);

export const UpdateHowtodoc = createAction(
    EHowtodocActions.UpdateHowtodoc,
    props<{howtodoc: Howtodoc}>()
);

export const HowtodocUpdated = createAction(
    EHowtodocActions.HowtodocUpdated,
    props<{howtodoc: Howtodoc}>()
);

export const DeleteHowtodoc = createAction(
    EHowtodocActions.DeleteHowtodoc,
    props<{howtodocId: string}>()
);

