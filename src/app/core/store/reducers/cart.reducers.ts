import { initialCartState, CartState } from '../state/cart.state';
import { UpdateCartProductList, UpdateCartTotalSuccess } from '../actions/cart.actions';
import { createReducer, on, Action } from '@ngrx/store';

export const cartReducers = createReducer(
    initialCartState,
    on(UpdateCartProductList, (state, {products}) => ({
        ...state,
        cartProductsList: products
    })),
    on(UpdateCartTotalSuccess, (state, {cartTotal, cartSubTotal}) => ({
        ...state,
        cartTotal: cartTotal,
        cartSubTotal: cartSubTotal
    })),
);

export function reducer(state: CartState | undefined, action: Action) {
    return cartReducers(state, action);
}
