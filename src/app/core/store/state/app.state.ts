import { RouterReducerState } from '@ngrx/router-store';
import { UserState } from './user.state';
import { ProductState } from './product.state';
import { HelpState } from './help.state';
import { CartState } from './cart.state';
import { RequirementState } from './requirement.state';
import { InterviewState } from './interview.state';

export interface AppState {
    router?: RouterReducerState;
    users: UserState;
    products: ProductState;
    queries: HelpState;
    cart: CartState;
    requirement: RequirementState;
    interview: InterviewState;
}

export const initialAppState: AppState = {
    users: null,
    products: null,
    queries: null,
    cart: null,
    requirement: null,
    interview: null,
};

export function getInitialAppState(): AppState {
    return initialAppState;
}

