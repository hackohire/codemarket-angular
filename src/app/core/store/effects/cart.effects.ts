import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { map, withLatestFrom, tap, switchMap} from 'rxjs/operators/';
import { AddToCart, UpdateCartProductList, RemoveProductFromCart, UpdateCartTotal, UpdateCartTotalSuccess, GetPurchasedItemsByUser, SetPurchasedItemsByUser, GetCartProductsList } from '../actions/cart.actions';
import { selectAllProductsList } from '../selectors/product.selectors';
import { of } from 'rxjs';
import { selectCartProductList } from '../selectors/cart.selectors';
import { SellingProductsService } from 'src/app/selling/selling-products.service';

@Injectable()
export class CartEffects {

    @Effect()
    // addProductToCart$ = this.actions$.pipe(
    //     ofType(AddToCart),
    //     map(action => action.productId),
    //     withLatestFrom(this._store.select(selectCartProductList)),
    //     switchMap(([id, products]) => {
    //         const i = products.length ? products.findIndex(prod => prod === id) : -1;
    //         // products[i].addedToCart = true;
    //         if (i < 0) {
    //             products.push(id);
    //         }
    //         return of(products);
    //     }),
    //     tap(t => console.log(t)),
    //     switchMap((productIds: string[]) => [UpdateCartProductList({products: productIds}), UpdateCartTotal()])
    // );

    addProductToCart$ = this.actions$.pipe(
        ofType(AddToCart),
        map(action => action.productId),
        switchMap((id: string) => {
            return this.sellingService.addToCart(id);
        }),
        map(cartItems => cartItems && cartItems.length ? cartItems.map(i => i.referenceId) : []),
        switchMap((cartItems) => [UpdateCartProductList({cartItems}), UpdateCartTotal({cartItems})])
    );

    @Effect()
    updateCartTotal$ = this.actions$.pipe(
        ofType(UpdateCartTotal),
        // tap((t) => console.log(t)),
        map(action => action.cartItems),
        switchMap((list) => list ? of(list) : this._store.select(selectCartProductList)),
        switchMap((items) => {
            let total = 0;
            items.forEach((i) => {
                total += i.price;
            });
            return of(total);
        }),
        switchMap((total: number) => of(UpdateCartTotalSuccess({cartTotal: total})))
    );

    @Effect()
    removeProductFromCart$ = this.actions$.pipe(
        ofType(RemoveProductFromCart),
        map(action => action.productId),
        switchMap((id: string) => {
            return this.sellingService.removeItemFromCart(id);
        }),
        tap(t => console.log(t)),
        map(cartItems => cartItems && cartItems.length ? cartItems.map(i => i.referenceId) : []),
        switchMap((cartItems) => [UpdateCartProductList({cartItems}), UpdateCartTotal({cartItems})])
        // switchMap((productIds: string[]) => of(UpdateCartProductList({products: productIds}), UpdateCartTotal()))
    );


    @Effect()
    getCartProductsList$ = this.actions$.pipe(
        ofType(GetCartProductsList),
        switchMap(() => this.sellingService.getCartItemsList()),
        map(cartItems => cartItems && cartItems.length ? cartItems.map(i => i.referenceId) : []),
        switchMap((cartItems) => [UpdateCartProductList({cartItems}), UpdateCartTotal({cartItems})])
    );

    @Effect()
    getPurchasedItemsByUser$ = this.actions$.pipe(
        ofType(GetPurchasedItemsByUser),
        switchMap(() => this.sellingService.getPurchasedUnitsByUserId()),
        tap(u => console.log(u)),
        map((purchasedItems: any[]) => {
            console.log(purchasedItems);
            return SetPurchasedItemsByUser({purchasedItems});
        })
    );

    constructor(
        private actions$: Actions,
        private _store: Store<AppState>,
        private sellingService: SellingProductsService
    ) {

    }
}
