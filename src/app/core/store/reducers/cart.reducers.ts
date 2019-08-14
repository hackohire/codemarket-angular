import { initialCartState, CartState } from '../state/cart.state';
import { CartActions, ECartActions } from '../actions/cart.actions';

export function cartReducers(
    state = initialCartState,
    action: CartActions
): CartState {
    switch (action.type) {
        case ECartActions.UpdateCartProductList:
            return {
                ...state,
                cartProductsList: action.products
            };

        case ECartActions.UpdateCartTotalSuccess:
            return {
                ...state,
                cartTotal: action.cartTotal,
                cartSubTotal: action.cartSubTotal
            };
        default:
            return state;
    }
}

