import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { EProductActions, AddPrdouct, ProductAdded, GetProductsByUserId, ProductList } from '../actions/product.actions';
import { map, switchMap, tap } from 'rxjs/operators';
import { SellingProductsService } from 'src/app/selling/selling-products.service';
import { Product } from 'src/app/shared/models/product.model';
import { of } from 'rxjs/internal/observable/of';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';

@Injectable()
export class ProductEffects {

    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private sellingProductService: SellingProductsService,
        private sweetAlertService: SweetalertService
    ) {}

    @Effect()
    addProduct$ = this.actions$.pipe(
        ofType<AddPrdouct>(EProductActions.AddPrdouct),
        map(action => action.product),
        switchMap((product) => this.sellingProductService.addProduct(product)),
        tap(u => console.log(u)),
        map((product: Product) => {
            console.log(product);
            this.sweetAlertService.success('Product Added Successfully', '', 'success');
            return new ProductAdded(product);
        })
    );

    @Effect()
    getProductsByUserId$ = this.actions$.pipe(
        ofType<GetProductsByUserId>(EProductActions.GetProductsByUserId),
        switchMap(() => this.sellingProductService.getProductsByUserId()),
        tap(u => console.log(u)),
        map((products: Product[]) => {
            console.log(products);
            return new ProductList(products);
        })
    );
}
