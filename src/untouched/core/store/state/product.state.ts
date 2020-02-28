import { Product } from 'src/app/shared/models/product.model';

export interface ProductState {
    products: Product[];
    selectedProduct: Product;
    allProducts: Product[];
}

export const initialProductState: ProductState = {
    products: null,
    selectedProduct: null,
    allProducts: null
};

