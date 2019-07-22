import { Injectable } from '@angular/core';
import { Product } from '../shared/models/product.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SellingProductsService {

  productFields = `
    _id
    name
    createdBy
    categories
    description
    shortDescription
    demo_url
    video_url
    documentation_url
    totalPrice
  `;

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
              ${this.productFields}
            }
          }
        `,
        variables: {
          product: product
        }
      }
    ).pipe(
      map((p) => p.data.addProduct),
    );
  }

  getProductsByUserId(): Observable<Product[]> {
    return this.apollo.query(
      {
        query: gql`
          query getProductsByUserId($userId: String) {
            getProductsByUserId(userId: $userId) {
              ${this.productFields}
            }
          }
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
