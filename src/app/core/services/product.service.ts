import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { productConstants } from 'src/app/shared/constants/product_constants';
import { Product } from 'src/app/shared/models/product.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productFields = productConstants.productQueryFields;

  constructor(
    private apollo: Apollo
  ) { }

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
}
