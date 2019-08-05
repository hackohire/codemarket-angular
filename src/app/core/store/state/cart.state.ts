import { Product } from 'src/app/shared/models/product.model';

export interface CartState {
    cartProductsList: string[];
    cartSubTotal: number;
    cartTotal: number;
}

export const initialCartState: CartState = {
    cartProductsList: [],
    cartSubTotal: null,
    cartTotal: null
};

