import { Testing } from 'src/app/shared/models/testing.model';

export interface TestingState {
    testings: Testing[];
    selectedTesting: Testing;
    allTestings: Testing[];
}

export const initialTestingState: TestingState = {
    testings: null,
    selectedTesting: null,
    allTestings: null
};

