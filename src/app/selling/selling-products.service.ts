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

  purchaseItemsField = `
    reference_id {
      name
      _id
      tags {
        name
        _id
      }
      createdBy {
        name
        _id
        avatar
      }
    }
  `;

  cartFields = `
    referenceId {
      name
      _id
      shortDescription
      price
      tags {
        name
        _id
      }
    }
  `

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
      map((p) => p.data.updateProduct),
    );
  }

  getProductsByUserId(userId: string, status: string): Observable<Product[]> {
    return this.apollo.query(
      {
        query: gql`
          query getProductsByUserId($userId: String, $status: String) {
            getProductsByUserId(userId: $userId, status: $status) {
              ...Product
            }
          }
          ${this.productFields}
        `,
        variables: {
          userId: userId,
          status: status
        },
        fetchPolicy: 'no-cache'
      },
    ).pipe(
      map((p: any) => {
        return p.data.getProductsByUserId;
      }),
    );
  }

  addTransaction(transaction) {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation addTransaction($transaction: TransactionInput) {
            addTransaction(transaction: $transaction) {
              ${this.purchaseItemsField}
            }
          }
        `,
        variables: {
          transaction: transaction
        }
      }
    ).pipe(
      map((p) => p.data.addTransaction),
    );
  }

  getPurchasedUnitsByUserId(): Observable<any[]> {
    return this.apollo.query(
      {
        query: gql`
          query getPurchasedUnitsByUserId($userId: String) {
            getPurchasedUnitsByUserId(userId: $userId) {
              ${this.purchaseItemsField}
            }
          }
        `,
        variables: {
          userId: this.auth.loggedInUser._id
        },
        fetchPolicy: 'no-cache'
      },
    ).pipe(
      map((p: any) => {
        return p.data.getPurchasedUnitsByUserId;
      }),
    );
  }

  addToCart(id: string) {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation addToCart( $userId: String, $referenceId: String) {
            addToCart(userId: $userId, referenceId: $referenceId) {
              ${this.cartFields}
            }
          }
        `,
        variables: {
          referenceId: id,
          userId: this.auth.loggedInUser._id
        }
      }
    ).pipe(
      map((p) => p.data.addToCart),
    );
  }
  

  getCartItemsList(): Observable<any[]> {
    return this.apollo.query(
      {
        query: gql`
          query getCartItemsList($userId: String) {
            getCartItemsList(userId: $userId) {
              ${this.cartFields}
            }
          }
        `,
        variables: {
          userId: this.auth.loggedInUser._id
        },
        fetchPolicy: 'no-cache'
      },
    ).pipe(
      map((p: any) => {
        return p.data.getCartItemsList;
      }),
    );
  }

  removeItemFromCart(id: string) {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation removeItemFromCart( $userId: String, $referenceId: String) {
            removeItemFromCart(userId: $userId, referenceId: $referenceId) {
              ${this.cartFields}
            }
          }
        `,
        variables: {
          referenceId: id,
          userId: this.auth.loggedInUser._id
        }
      }
    ).pipe(
      map((p) => p.data.removeItemFromCart),
    );
  }
}
