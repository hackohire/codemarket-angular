import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(
    private apollo: Apollo,
  ) { }

  /** Get Quote graphql API call to save the quote fields in the DB */
  getQuote(formFieldObject) {
    return this.apollo.mutate(
      {
        /** Mutation Query */
        mutation: gql`
        mutation getQuote($quote: QuoteFieldsInput) {
          getQuote(quote: $quote) {
            name
            email
            zipCode
            age
            sex
            coverageAmount
            termLength
            healthLevel
          }
        }
      `,
        variables: {
          quote: formFieldObject
        },
      }
    ).pipe(
      map((p: any) => {
        return p.data.getQuote;
      }),
    );
  }
}
