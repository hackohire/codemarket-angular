import { Product } from 'src/app/shared/models/product.model';

export interface CartState {
    cartProductsList: Product[];
}

export const initialCartState: CartState = {
    cartProductsList: null,
};

