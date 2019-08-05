import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { productConstants } from 'src/app/shared/constants/product_constants';
import { Product } from 'src/app/shared/models/product.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { selectCartProductList } from '../store/selectors/cart.selectors';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { of } from 'rxjs/internal/observable/of';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productFields = productConstants.productQueryFields;
  cartProductList: Observable<string[]>;

  constructor(
    private apollo: Apollo,
    private store: Store<AppState>
  ) {
    this.cartProductList = this.store.select(selectCartProductList);
  }

  getAllProducts(): Observable<Product[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllProducts {
            getAllProducts {
              ${this.productFields}
            }
          }
        `
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
              ${this.productFields}
            }
          }
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

  checkIfProductIsInCart(productId: string): Observable<boolean> {
    return this.cartProductList.pipe(
      switchMap((productIds: string[]) => {
        const doesProductExistInCart = false;
        if (productIds && productIds.length && productIds.filter(id  => id === productId).length) {
          return of(true);
        }
        return of(doesProductExistInCart);
      })
    );
  }
}
