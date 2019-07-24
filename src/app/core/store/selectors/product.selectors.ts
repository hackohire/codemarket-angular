import { AppState } from '../state/app.state';
import { createSelector, select } from '@ngrx/store';
import { ProductState } from '../state/product.state';

const selectProducts = (state: AppState) => state.products;

export const selectProductsList = createSelector(
    selectProducts,
    (state: ProductState) => state.products
);

export const selectAllProductsList = createSelector(
    selectProducts,
    (state: ProductState) => state.allProducts
);

export const selectSelectedProduct = createSelector(
    selectProducts,
    (state: ProductState) => state.selectedProduct
);
