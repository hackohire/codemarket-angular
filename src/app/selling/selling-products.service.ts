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

  addProduct(product: Product): Observable<Product> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation addProduct($product: ProductInput) {
            addProduct(product: $product) {
              _id
              name
              createdBy
            }
          }
        `,
        variables: {
          product: product
        }
      }
    ).pipe(
      switchMap((p: any) => {
        console.log(p);
        return [p.data.addProduct];
      }),
      catchError(e => of(e))
    );
  }
}
