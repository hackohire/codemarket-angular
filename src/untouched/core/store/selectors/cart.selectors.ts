import { AppState } from '../state/app.state';
import { createSelector, select } from '@ngrx/store';
import { CartState } from '../state/cart.state';

const selectCart = (state: AppState) => state.cart;

export const selectCartProductList = createSelector(
    selectCart,
    (state: CartState) => state.cartProductsList
);

export const selectCartListLength = createSelector(
    selectCart,
    (state: CartState) => state.cartProductsList ? state.cartProductsList.length : 0
);

export const selectCartTotal = createSelector(
    selectCart,
    (state: CartState) =>  state.cartTotal
);

export const selectPurchasedItemsList = createSelector(
    selectCart,
    (state: CartState) => state.purchasedItems
);


