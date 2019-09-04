import { initialCartState, CartState } from '../state/cart.state';
import { UpdateCartProductList, UpdateCartTotalSuccess, GetPurchasedItemsByUser, SetPurchasedItemsByUser } from '../actions/cart.actions';
import { createReducer, on, Action } from '@ngrx/store';

export const cartReducers = createReducer(
    initialCartState,
    on(UpdateCartProductList, (state, {cartItems}) => ({
        ...state,
        cartProductsList: cartItems
    })),
    on(UpdateCartTotalSuccess, (state, {cartTotal}) => ({
        ...state,
        cartTotal: cartTotal,
    })),
    on(SetPurchasedItemsByUser, (state, {purchasedItems}) => ({
        ...state,
        purchasedItems: purchasedItems
    })),
);

export function reducer(state: CartState | undefined, action: Action) {
    return cartReducers(state, action);
}
