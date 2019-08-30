import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { productConstants } from 'src/app/shared/constants/product_constants';
import { Product, Tag } from 'src/app/shared/models/product.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { selectCartProductList, selectCartTotal } from '../store/selectors/cart.selectors';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { of } from 'rxjs/internal/observable/of';
import { selectAllProductsList } from '../store/selectors/product.selectors';
import { Router } from '@angular/router';
import { SetSelectedProduct } from '../store/actions/product.actions';
import * as _ from 'lodash';
import { withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productFields = productConstants.productQueryFields;
  cartProductListIds: Observable<string[]>;
  allProductsList: Observable<Product[]>;
  cartTotal: Observable<{ total: number, subTotal: number }>;

  constructor(
    private apollo: Apollo,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.cartProductListIds = this.store.select(selectCartProductList);
    this.allProductsList = this.store.select(selectAllProductsList);
    this.cartTotal = this.store.select(selectCartTotal);
  }

  getAllProducts(): Observable<Product[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllProducts {
            getAllProducts {
              ...Product
            }
          }
          ${this.productFields}
        `,
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllProducts;
      }),
    );
  }

  getProductById(productId: string): Observable<Product> {
    return this.apollo.query(
      {
        query: gql`
          query getProductById($productId: String) {
            getProductById(productId: $productId) {
              ...Product
            }
          }
          ${this.productFields}
        `,
        variables: {
          productId: productId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getProductById;
      }),
    );
  }

  deleteProduct(productId: string): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deleteProduct($productId: String) {
            deleteProduct(productId: $productId)
          }
        `,
        variables: {
          productId: productId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteProduct;
      }),
    );
  }

  checkIfProductIsInCart(productId: string): Observable<boolean> {
    return this.cartProductListIds.pipe(
      switchMap((productIds: string[]) => {
        const doesProductExistInCart = false;
        if (productIds && productIds.length && productIds.filter(id => id === productId).length) {
          return of(true);
        }
        return of(doesProductExistInCart);
      })
    );
  }

  getSingleProductForCartByProductId(productId): Observable<Product> {
    return this.allProductsList.pipe(
      switchMap((products: Product[]) => {
        return of(products.find(p => p._id === productId));
      })
    );
  }

  redirectToProductDetails(product: Product): void {
    this.store.dispatch(SetSelectedProduct({ product }));
    this.router.navigate(['/', { outlets: { main: ['dashboard', 'product-details', product._id] } }]);
  }

  getProductsInCart(): Observable<Product[]> {
    return this.store.select(selectCartProductList).pipe(
      withLatestFrom(this.store.select(selectAllProductsList)),
      map(([ids, products]) => {

        const mappedIdsArray = ids.map((id, i) => {
          const obj: any = {};
          obj._id = id;

          return obj;
        });

        const productInCart = _.intersectionBy(products, mappedIdsArray, '_id')
        return productInCart && productInCart.length ? productInCart : [];
      })
    );
  }
}
