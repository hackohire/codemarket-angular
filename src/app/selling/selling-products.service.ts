import { Injectable } from '@angular/core';
import { Product } from '../shared/models/product.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellingProductsService {

  constructor(
    private apollo: Apollo,
  ) { }

  addProduct(product: Product): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation addProduct($product: ProductInput) {
            addProduct(product: $product) {
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
}
