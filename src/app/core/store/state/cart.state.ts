import { Product } from 'src/app/shared/models/product.model';

export interface CartState {
    cartProductsList: string[];
}

export const initialCartState: CartState = {
    cartProductsList: [],
};

