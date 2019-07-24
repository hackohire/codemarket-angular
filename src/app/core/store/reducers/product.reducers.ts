import { ProductActions, EProductActions } from '../actions/product.actions';
import { initialProductState, ProductState } from '../state/product.state';

export function productReducers(
    state = initialProductState,
    action: ProductActions
): ProductState {
    switch (action.type) {

        case EProductActions.ProductAdded:
            return {
                ...state,
                selectedProduct: action.product
            };

        case EProductActions.ProductUpdated:
            return {
                ...state,
                selectedProduct: action.product
            };

        case EProductActions.ProductList:
            return {
                ...state,
                products: action.products
            };

        case EProductActions.SetSelectedProduct:
            return {
                ...state,
                selectedProduct: action.product
            };

        case EProductActions.SetAllProductsList:
            return {
                ...state,
                allProducts: action.products
            };

        default:
            return state;
    }
};
