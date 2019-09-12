import { RouterReducerState } from '@ngrx/router-store';
import { UserState } from './user.state';
import { ProductState } from './product.state';
import { HelpState } from './help.state';
import { CartState } from './cart.state';
import { RequirementState } from './requirement.state';
import { InterviewState } from './interview.state';
import { TestingState } from './testing.state';
import { HowtodocState } from './howtodoc.state';
import { DesignState } from './design.state';

export interface AppState {
    router?: RouterReducerState;
    users: UserState;
    products: ProductState;
    queries: HelpState;
    cart: CartState;
    requirement: RequirementState;
    interview: InterviewState;
    testing: TestingState;
    howtodoc: HowtodocState,
    design: DesignState
}

export const initialAppState: AppState = {
    users: null,
    products: null,
    queries: null,
    cart: null,
    requirement: null,
    interview: null,
    testing: null,
    howtodoc: null,
    design: null
};

export function getInitialAppState(): AppState {
    return initialAppState;
}

