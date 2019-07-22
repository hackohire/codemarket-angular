import { Action } from '@ngrx/store';
import { Product } from 'src/app/shared/models/product.model';

export enum EProductActions {
    AddPrdouct = '[Product] Add Product',
    ProductAdded = '[Product] Product Added',
    GetProductsByUserId = '[Product] Get Products By User Id',
    ProductList = '[Product] ProductList'
}


export class AddPrdouct implements Action {
    public readonly type = EProductActions.AddPrdouct;
    constructor(public product: Product) {}
}

export class ProductAdded implements Action {
    public readonly type = EProductActions.ProductAdded;
    constructor(public product: Product) {}
}

export class GetProductsByUserId implements Action {
    public readonly type = EProductActions.GetProductsByUserId;
    constructor() {}
}

export class ProductList implements Action {
    public readonly type = EProductActions.ProductList;
    constructor(public products: Product[]) {}
}

export type ProductActions = AddPrdouct | ProductAdded | GetProductsByUserId | ProductList;

