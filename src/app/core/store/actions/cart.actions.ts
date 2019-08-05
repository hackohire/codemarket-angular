import { Action } from '@ngrx/store';
import { User } from 'src/app/shared/models/user.model';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
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


export class AddToCart implements Action {
    public readonly type = ECartActions.AddToCart;
    constructor(public productId: string) {}
}

export class AddedToCartSuccessfully implements Action {
    public readonly type = ECartActions.AddedToCartSuccessfully;
    constructor(public product: Product) {}
}

export class UpdateCartProductList implements Action {
    public readonly type = ECartActions.UpdateCartProductList;
    constructor(public products: string[]) {}
}

export class GetCartProductsList implements Action {
    public readonly type = ECartActions.GetCartProductsList;
    constructor() {}
}

export class RemoveProductFromCart implements Action {
    public readonly type = ECartActions.RemoveProductFromCart;
    constructor(public productId: string) {}
}

export class UpdateCartTotal implements Action {
    public readonly type = ECartActions.UpdateCartTotal;
    constructor() {}
}

export class UpdateCartTotalSuccess implements Action {
    public readonly type = ECartActions.UpdateCartTotalSuccess;
    constructor(public cartTotal: number, public cartSubTotal: number) {}
}



export type CartActions = AddToCart | AddedToCartSuccessfully | RemoveProductFromCart |
            UpdateCartProductList | UpdateCartTotal | UpdateCartTotalSuccess | GetCartProductsList;

