import { createAction, props } from '@ngrx/store';
import { Product } from 'src/app/shared/models/product.model';

export enum ECartActions {
    AddToCart = '[Cart] Add To Cart',
    AddedToCartSuccessfully = '[Cart] Added To Cart Successfully',
    RemoveProductFromCart = '[Cart] Remove Product From Cart',

    UpdateCartProductList = '[Cart] Update Cart Product List',
    UpdateCartTotal = '[Cart] Update Cart Total',
    UpdateCartTotalSuccess = '[Cart] Update Cart Total Success',

    GetCartProductsList = '[Cart] Get Cart Products List'
}

export const AddToCart = createAction(
    ECartActions.AddToCart,
    props<{productId: string}>()
);

export const AddedToCartSuccessfully = createAction(
    ECartActions.AddedToCartSuccessfully,
    props<{product: Product}>()
);

export const UpdateCartProductList = createAction(
    ECartActions.UpdateCartProductList,
    props<{products: string[]}>()
);

export const GetCartProductsList = createAction(
    ECartActions.GetCartProductsList
);

export const RemoveProductFromCart = createAction(
    ECartActions.RemoveProductFromCart,
    props<{productId: string}>()
);

export const UpdateCartTotal = createAction(
    ECartActions.UpdateCartTotal
);

export const UpdateCartTotalSuccess = createAction(
    ECartActions.UpdateCartTotalSuccess,
    props<{cartTotal: number, cartSubTotal: number}>()
);