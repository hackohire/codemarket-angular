export interface CartState {
    cartProductsList: string[];
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

