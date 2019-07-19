import { Action } from '@ngrx/store';
import { Product } from 'src/app/shared/models/product.model';

export enum EProductActions {
    AddPrdouct = '[Product] Add Product',
    ProductAdded = '[Product] Product Added'
}


export class AddPrdouct implements Action {
    public readonly type = EProductActions.AddPrdouct;
    constructor(public product: Product) {}
}

export class ProductAdded implements Action {
    public readonly type = EProductActions.ProductAdded;
    constructor(public product: Product) {}
}

export type ProductActions = AddPrdouct | ProductAdded;

