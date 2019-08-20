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

