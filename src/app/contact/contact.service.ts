import { Injectable } from '@angular/core';
import {Contact} from '../shared/models/contact.model';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contactFileds = gql`
  fragment contact on contact {
    firstName
    lastName
    email
    phone
    address
    showDate
  }`;

  constructor(
    private apollo: Apollo,
    private router: Router,
  ) { }


  addcontact(contact: any): Observable<Contact> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addcontact($contact: contactInput) {
          addcontact(contact: $contact) {
            ...contact
          }
        }
        ${this.contactFileds}
      `,
      variables: {
        contact
      }
    }).pipe(
      map((q: any) => q.data.addcontact)
    );
  }

  fetchcontact(): Observable<any> {
    return this.apollo.query({
      query: gql`
        query fetchcontact {
          fetchcontact{
            firstName
            lastName
            email
            phone
            address
            showDate
          }
        }
      `,
      variables: {
      }
    }).pipe(
      map((q: any) => q.data.fetchcontact)
    );
  }

  redirectToCompanyDetails(companyId: string, view = 'home') {
    this.router.navigate(['/', 'dashboard']);
  }

}
