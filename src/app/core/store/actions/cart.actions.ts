import { Action } from '@ngrx/store';
import { User } from 'src/app/shared/models/user.model';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { Product } from 'src/app/shared/models/product.model';

export enum ECartActions {
    AddToCart = '[Cart] Add To Cart',
    AddedToCartSuccessfully = '[Cart] Added To Cart Successfully',

    UpdateCartProductList = '[Cart] Update Cart Product List',

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
    constructor(public products: Product[]) {}
}

export class GetCartProductsList implements Action {
    public readonly type = ECartActions.GetCartProductsList;
    constructor() {}
}

export type CartActions = AddToCart | AddedToCartSuccessfully | UpdateCartProductList | GetCartProductsList;

