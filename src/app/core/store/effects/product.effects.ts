import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { AddPrdouct, GetProductsByUserId, ProductList, UpdatePrdouct, ProductUpdated, GetProductById, SetSelectedProduct, GetAllProducts, SetAllProductsList, DeleteProduct } from '../actions/product.actions';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { SellingProductsService } from 'src/app/selling/selling-products.service';
import { Product } from 'src/app/shared/models/product.model';
import { SweetalertService } from 'src/app/shared/services/sweetalert.service';
import { ProductService } from '../../services/product.service';
import { selectProductsList } from '../selectors/product.selectors';

@Injectable()
export class ProductEffects {

    constructor(
        private actions$: Actions,
        private sellingProductService: SellingProductsService,
        private productService: ProductService,
        private sweetAlertService: SweetalertService,
        private store: Store<AppState>
    ) {}

    @Effect({dispatch: false})
    addProduct$ = this.actions$.pipe(
        ofType(AddPrdouct),
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
        ofType(UpdatePrdouct),
        map(action => action.product),
        switchMap((product) => this.sellingProductService.updateProduct(product)),
        tap(u => console.log(u)),
        map((product: Product) => {
            console.log(product);
            this.sweetAlertService.success('Product Updated Successfully', '', 'success');
            return ProductUpdated({product});
        })
    );

    @Effect()
    getProductsByUserId$ = this.actions$.pipe(
        ofType(GetProductsByUserId),
        switchMap(() => this.sellingProductService.getProductsByUserId()),
        tap(u => console.log(u)),
        map((product: Product[]) => {
            console.log(product);
            return ProductList({product});
        })
    );

    @Effect()
    getProductById$ = this.actions$.pipe(
        ofType(GetProductById),
        map(action => action.productId),
        switchMap((productId) => this.productService.getProductById(productId)),
        tap(u => console.log(u)),
        map((product) => {
            console.log(product);
            return SetSelectedProduct({product});
        })
    );


    @Effect()
    getAllProductsList$ = this.actions$.pipe(
        ofType(GetAllProducts),
        switchMap(() => this.productService.getAllProducts()),
        tap(u => console.log(u)),
        map((product) => {
            console.log(product);
            return SetAllProductsList({product});
        })
    );

    @Effect()
    deleteProduct$ = this.actions$.pipe(
        ofType(DeleteProduct),
        map(action => action.productId),
        switchMap((productId: string) => {
            return this.productService.deleteProduct(productId).pipe(
                withLatestFrom(this.store.select(selectProductsList)),
                map(([isDeleted, products]) => {
                    if (isDeleted && products && products.length) {
                        let deletedProductIndex = -1;
                        deletedProductIndex = products.findIndex((p) => p._id === productId);
                        if (deletedProductIndex > -1) {
                            products.splice(deletedProductIndex, 1);
                        }
                        return [...products];
                    }
                })
            );
        }),
        map((product: Product[]) => {
            return ProductList({product});
        }),
        // tap(u => console.log(u)),
        // map((product) => {
        //     console.log(product);
        //     return SetAllProductsList({product});
        // })
    );
}
