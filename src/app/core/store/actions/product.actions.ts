import { Action } from '@ngrx/store';
import { Product } from 'src/app/shared/models/product.model';

export enum EProductActions {
    AddPrdouct = '[Product] Add Product',
    ProductAdded = '[Product] Product Added',
    UpdatePrdouct = '[Product] Update Product',
    ProductUpdated = '[Product] Product Updated',
    GetProductsByUserId = '[Product] Get Products By User Id',
    GetProductById = '[Product] Get Product By Id',
    ProductList = '[Product] ProductList',

    SetSelectedProduct = '[Product] Select Product'
}


export class AddPrdouct implements Action {
    public readonly type = EProductActions.AddPrdouct;
    constructor(public product: Product) {}
}

export class ProductAdded implements Action {
    public readonly type = EProductActions.ProductAdded;
    constructor(public product: Product) {}
}

export class UpdatePrdouct implements Action {
    public readonly type = EProductActions.UpdatePrdouct;
    constructor(public product: Product) {}
}

export class ProductUpdated implements Action {
    public readonly type = EProductActions.ProductUpdated;
    constructor(public product: Product) {}
}

export class GetProductsByUserId implements Action {
    public readonly type = EProductActions.GetProductsByUserId;
    constructor() {}
}

export class GetProductById implements Action {
    public readonly type = EProductActions.GetProductById;
    constructor(public productId: string) {}
}

export class ProductList implements Action {
    public readonly type = EProductActions.ProductList;
    constructor(public products: Product[]) {}
}

export class SetSelectedProduct implements Action {
    public readonly type = EProductActions.SetSelectedProduct;
    constructor(public product: Product) {}
}

export type ProductActions = AddPrdouct | ProductAdded | UpdatePrdouct | ProductUpdated
            | GetProductsByUserId | GetProductById | ProductList | SetSelectedProduct;

