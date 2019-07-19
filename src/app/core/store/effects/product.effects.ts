import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { EProductActions, AddPrdouct, ProductAdded } from '../actions/product.actions';
import { map, switchMap, tap } from 'rxjs/operators';
import { SellingProductsService } from 'src/app/selling/selling-products.service';
import { Product } from 'src/app/shared/models/product.model';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class ProductEffects {

    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private sellingProductService: SellingProductsService
    ) {}

    @Effect()
    addProduct$ = this.actions$.pipe(
        ofType<AddPrdouct>(EProductActions.AddPrdouct),
        map(action => action.product),
        switchMap((product) => this.sellingProductService.addProduct(product)),
        tap(u => console.log(u)),
        switchMap((product) => of(new ProductAdded(product)))
    );
}
