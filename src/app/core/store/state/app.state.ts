import { RouterReducerState } from '@ngrx/router-store';
import { UserState } from './user.state';
import { ProductState } from './product.state';
import { CartState } from './cart.state';
import { PostState } from './post.state';

export interface AppState {
    router?: RouterReducerState;
    users: UserState;
    products: ProductState;
    cart: CartState;
    post: PostState;
}

export const initialAppState: AppState = {
    users: null,
    products: null,
    cart: null,
    post: null
};

export function getInitialAppState(): AppState {
    return initialAppState;
}

