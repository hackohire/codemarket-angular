import { initialTestingState, TestingState } from '../state/testing.state';
import { TestingAddedSuccessfully, TestingList, SetSelectedTesting, SetAllTestingsList } from '../actions/testing.actions';
import { on, createReducer, Action } from '@ngrx/store';


export const testingReducers = createReducer(
    initialTestingState,
    on(TestingAddedSuccessfully, (state, {testing}) => ({
        ...state,
        selectedTesting: testing
    })),


    on(TestingList, (state, {testing}) => ({
        ...state,
        testings: testing
    })),
    on(SetSelectedTesting, (state, {testing}) => ({
        ...state,
        selectedTesting: testing
    })),
    on(SetAllTestingsList, (state, {testing}) => ({
        ...state,
        allTestings: testing
    })),
);

export function reducer(state: TestingState | undefined, action: Action) {
    return testingReducers(state, action);
}
