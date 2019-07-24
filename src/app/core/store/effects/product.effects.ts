import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { EProductActions, AddPrdouct, ProductAdded, GetProductsByUserId, ProductList, UpdatePrdouct, ProductUpdated, GetProductById, SetSelectedProduct, GetAllProducts, SetAllProductsList } from '../actions/product.actions';
import { map, switchMap, tap } from 'rxjs/operators';
import { SellingProductsService } from 'src/app/selling/selling-products.service';
import { Product } from 'src/app/shared/models/product.model';
import { of } from 'rxjs/internal/observable/of';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { ProductService } from '../../services/product.service';

@Injectable()
export class ProductEffects {

    constructor(
        private store: Store<AppState>,
        private actions$: Actions,
        private sellingProductService: SellingProductsService,
        private productService: ProductService,
        private sweetAlertService: SweetalertService
    ) {}

    @Effect({dispatch: false})
    addProduct$ = this.actions$.pipe(
        ofType<AddPrdouct>(EProductActions.AddPrdouct),
        map(action => action.product),
        switchMap((product) => this.sellingProductService.addProduct(product)),
        tap(u => console.log(u)),
        tap((product: Product) => {
            console.log(product);
            this.sweetAlertService.success('Product Added Successfully', '', 'success');
            // return new ProductAdded(product);
        })
    );

    @Effect()
    updateProduct$ = this.actions$.pipe(
        ofType<UpdatePrdouct>(EProductActions.UpdatePrdouct),
        map(action => action.product),
        switchMap((product) => this.sellingProductService.updateProduct(product)),
        tap(u => console.log(u)),
        map((product: Product) => {
            console.log(product);
            this.sweetAlertService.success('Product Updated Successfully', '', 'success');
            return new ProductUpdated(product);
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

    @Effect()
    getProductById$ = this.actions$.pipe(
        ofType<GetProductById>(EProductActions.GetProductById),
        map(action => action.productId),
        switchMap((productId) => this.sellingProductService.getProductById(productId)),
        tap(u => console.log(u)),
        map((product) => {
            console.log(product);
            return new SetSelectedProduct(product);
        })
    );


    @Effect()
    getAllProductsList$ = this.actions$.pipe(
        ofType<GetAllProducts>(EProductActions.GetAllProducts),
        switchMap(() => this.productService.getAllProducts()),
        tap(u => console.log(u)),
        map((products) => {
            console.log(products);
            return new SetAllProductsList(products);
        })
    );
}
