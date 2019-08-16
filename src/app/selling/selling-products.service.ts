import { Injectable } from '@angular/core';
import { Product } from '../shared/models/product.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { productConstants } from '../shared/constants/product_constants';

@Injectable({
  providedIn: 'root'
})
export class SellingProductsService {

  productFields = productConstants.productQueryFields;

  constructor(
    private apollo: Apollo,
    private auth: AuthService
  ) { }

  addProduct(product: Product): Observable<Product> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation addProduct($product: ProductInput) {
            addProduct(product: $product) {
              ...Product
            }
          }
          ${this.productFields}
        `,
        variables: {
          product: product
        }
      }
    ).pipe(
      map((p) => p.data.addProduct),
    );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateProduct($product: ProductInput) {
            updateProduct(product: $product) {
              ..Product
            }
          }
          ${this.productFields}
        `,
        variables: {
          product: product
        }
      }
    ).pipe(
      map((p) => p.data.updateProduct),
    );
  }

  getProductsByUserId(): Observable<Product[]> {
    return this.apollo.query(
      {
        query: gql`
          query getProductsByUserId($userId: String) {
            getProductsByUserId(userId: $userId) {
              ...Product
            }
          }
          ${this.productFields}
        `,
        variables: {
          userId: this.auth.loggedInUser._id
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getProductsByUserId;
      }),
    );
  }
}
