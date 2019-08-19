import { ProductAdded, ProductUpdated, ProductList, SetSelectedProduct, SetAllProductsList } from '../actions/product.actions';
import { initialProductState } from '../state/product.state';
import { createReducer, on } from '@ngrx/store';


export const productReducers = createReducer(
    initialProductState,
    on(ProductAdded, (state, {product}) => ({
        ...state,
        selectedProduct: product
    })),
    on(ProductUpdated, (state, {product}) => ({
        ...state,
        selectedProduct: product
    })),
    on(ProductList, (state, {product}) => ({
        ...state,
        products: product
    })),
    on(SetSelectedProduct, (state, {product}) => ({
        ...state,
        selectedProduct: product
    })),
    on(SetAllProductsList, (state, {product}) => ({
        ...state,
        allProducts: product
    })),
);
