import { RouterReducerState } from '@ngrx/router-store';
import { UserState } from './user.state';
import { ProductState } from './product.state';

export interface AppState {
    router?: RouterReducerState;
    users: UserState;
    products: ProductState;
}

export const initialAppState: AppState = {
    users: null,
    products: null
};

export function getInitialAppState(): AppState {
    return initialAppState;
}

