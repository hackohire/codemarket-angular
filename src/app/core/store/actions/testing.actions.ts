import { createAction, props } from '@ngrx/store';
import { Testing } from 'src/app/shared/models/testing.model';

export enum ETestingActions {
    AddTesting = '[Testing] Add Testing',
    TestingAddedSuccessfully = '[Testing] Testing Added Successfully',

    UpdateTesting = '[Testing] Update Testing',
    TestingUpdated = '[Testing] Testing Updated',
    DeleteTesting = '[Testing] Delete Testing',

    GetAllTestings = '[Testing] Get All Testings', // List of All Testings in the platform
    GetTestingsByUserId = '[Testing] Get Testings By User Id',
    GetTestingById = '[Testing] Get Testing By Id',
    TestingList = '[Testing] TestingList', // List of Testings Created by LoggedIn User

    SetAllTestingsList = '[Testing] Set All Testings List', // Set the List of All Testings within the platform
    SetSelectedTesting = '[Testing] Select Testing'


}

export const AddTesting = createAction(
    ETestingActions.AddTesting,
    props<{testing: Testing}>()
);

export const TestingAddedSuccessfully = createAction(
    ETestingActions.TestingAddedSuccessfully,
    props<{testing: Testing}>()
);


export const GetTestingsByUserId = createAction(
    ETestingActions.GetTestingsByUserId,
    props<{userId: string, status: string}>()
);

export const GetTestingById = createAction(
    ETestingActions.GetTestingById,
    props<{testingId: string}>()
);

export const TestingList = createAction(
    ETestingActions.TestingList,
    props<{testing: Testing[]}>()
);

export const SetSelectedTesting = createAction(
    ETestingActions.SetSelectedTesting,
    props<{testing: Testing}>()
);

export const GetAllTestings = createAction(
    ETestingActions.GetAllTestings
);

export const SetAllTestingsList = createAction(
    ETestingActions.SetAllTestingsList,
    props<{testing: Testing[]}>()
);

export const UpdateTesting = createAction(
    ETestingActions.UpdateTesting,
    props<{testing: Testing}>()
);

export const TestingUpdated = createAction(
    ETestingActions.TestingUpdated,
    props<{testing: Testing}>()
);

export const DeleteTesting = createAction(
    ETestingActions.DeleteTesting,
    props<{testingId: string}>()
);

