import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import gql from 'graphql-tag';
import { Quote } from '../shared/models/quote.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  quoteFileds = gql`
  fragment Quote on Quote {
    firstName
    email
    phone
    InsuranceType
    description
  }`;

  constructor(private apollo: Apollo,
    private router: Router) { }

    addquote(formFieldObject) {
      return this.apollo.mutate({
        mutation: gql`
          mutation addquote($quote: quoteInput) {
            addquote(quote: $quote) {
              firstName
              email
              phone
              InsuranceType
              description
            }
          }
        `,
        variables: {
          quote :formFieldObject
        },
      }).pipe(
        map((p: any) => {
          return p.data.addquote;
        }),
      );
    }
  
    redirectToDashboard(companyId: string, view = 'home') {
      this.router.navigate(['/', 'dashboard']);
    }
  
  
    
    fetchquotes(): Observable<any> {
      return this.apollo.query({
        query: gql`
          query fetchquote {
            fetchquote{
              _id
              firstName
              email
              phone
              InsuranceType
              description
            }
          }
        `,
        variables: {
        }
      }).pipe(
        map((q: any) => q.data.fetchquote)
      );
    }
}
