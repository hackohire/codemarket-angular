import { RouterReducerState } from '@ngrx/router-store';
import { UserState } from './user.state';
import { ProductState } from './product.state';
import { HelpState } from './help.state';
import { CartState } from './cart.state';

export interface AppState {
    router?: RouterReducerState;
    users: UserState;
    products: ProductState;
    queries: HelpState;
    cart: CartState;
}

export const initialAppState: AppState = {
    users: null,
    products: null,
    queries: null,
    cart: null
};

export function getInitialAppState(): AppState {
    return initialAppState;
}

