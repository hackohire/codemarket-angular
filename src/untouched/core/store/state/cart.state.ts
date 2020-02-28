import { Product } from 'src/app/shared/models/product.model';

export interface CartState {
    cartProductsList: Product[];
    cartSubTotal: number;
    cartTotal: number;

    purchasedItems: any [];
}

export const initialCartState: CartState = {
    cartProductsList: [],
    cartSubTotal: null,
    cartTotal: null,

    purchasedItems: []
};

