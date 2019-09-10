import { Action, createAction, props } from '@ngrx/store';
import { Product } from 'src/app/shared/models/product.model';

export enum EProductActions {
    AddPrdouct = '[Product] Add Product',
    ProductAdded = '[Product] Product Added',

    UpdatePrdouct = '[Product] Update Product',
    ProductUpdated = '[Product] Product Updated',
    DeleteProduct = '[Product] Delete Product',

    GetAllProducts = '[Product] Get All Products', // List of All Products in the platform
    GetProductsByUserId = '[Product] Get Products By User Id',
    GetProductById = '[Product] Get Product By Id',
    ProductList = '[Product] ProductList', // List of Products Created by LoggedIn User

    SetAllProductsList = '[Product] Set All Products List', // Set the List of All Products within the platform
    SetSelectedProduct = '[Product] Select Product'
}

export const AddPrdouct = createAction(
    EProductActions.AddPrdouct,
    props<{product: Product}>()
);

export const ProductAdded = createAction(
    EProductActions.ProductAdded,
    props<{product: Product}>()
);

export const UpdatePrdouct = createAction(
    EProductActions.UpdatePrdouct,
    props<{product: Product}>()
);

export const ProductUpdated = createAction(
    EProductActions.ProductUpdated,
    props<{product: Product}>()
);



export const GetProductsByUserId = createAction(
    EProductActions.GetProductsByUserId,
    props<{userId: string, status: string}>()
);

export const GetProductById = createAction(
    EProductActions.GetProductById,
    props<{productId: string}>()
);

export const ProductList = createAction(
    EProductActions.ProductList,
    props<{product: Product[]}>()
);

export const SetSelectedProduct = createAction(
    EProductActions.SetSelectedProduct,
    props<{product: Product}>()
);

export const GetAllProducts = createAction(
    EProductActions.GetAllProducts
);

export const SetAllProductsList = createAction(
    EProductActions.SetAllProductsList,
    props<{product: Product[]}>()
);

export const DeleteProduct = createAction(
    EProductActions.DeleteProduct,
    props<{productId: string}>()
);

