import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { switchMap, map, withLatestFrom, tap} from 'rxjs/operators/';
import { AuthService } from 'src/app/core/services/auth.service';
import { HelpService } from 'src/app/help/help.service';
import { ECartActions, AddToCart, GetCartProductsList, UpdateCartProductList } from '../actions/cart.actions';
import { selectAllProductsList } from '../selectors/product.selectors';
import { Product } from 'src/app/shared/models/product.model';
import { UpdatePrdouct } from '../actions/product.actions';
import { of } from 'rxjs';

@Injectable()
export class CartEffects {

    @Effect()
    addProductToCart$ = this.actions$.pipe(
        ofType<AddToCart>(ECartActions.AddToCart),
        map(action => action.productId),
        withLatestFrom(this._store.select(selectAllProductsList)),
        switchMap(([id, products]) => {
            const i = products.findIndex(prod => prod._id === id);
            products[i].addedToCart = true;
            return of(products[i]);
        }),
        tap(t => console.log(t)),
        switchMap((product: Product) => of(new GetCartProductsList()))
    );


    @Effect()
    getCartProductsList$ = this.actions$.pipe(
        ofType<GetCartProductsList>(ECartActions.GetCartProductsList),
        switchMap(() => this._store.select(selectAllProductsList)),
        map((productsList) => {
            return productsList.filter(p => p.addedToCart);
        }),
        map((productsList) => new UpdateCartProductList(productsList))
    );


    constructor(
        private actions$: Actions,
        private _store: Store<AppState>,
        private helpService: HelpService,
        private authServie: AuthService
    ) {

    }
}
