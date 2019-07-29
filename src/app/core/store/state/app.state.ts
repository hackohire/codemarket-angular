import { RouterReducerState } from '@ngrx/router-store';
import { UserState } from './user.state';
import { ProductState } from './product.state';
import { HelpState } from './help.state';

export interface AppState {
    router?: RouterReducerState;
    users: UserState;
    products: ProductState;
    queries: HelpState;
}

export const initialAppState: AppState = {
    users: null,
    products: null,
    queries: null

};

export function getInitialAppState(): AppState {
    return initialAppState;
}

