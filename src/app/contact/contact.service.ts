import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Contact } from '../shared/models/contact.model';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contactFileds = gql`
  fragment Contact on Contact {
    name
    email
    subject
    description 
  }`;

  constructor(
    private apollo: Apollo,
    private router: Router,
  ) { }

  getContact(formFieldObject) {
    return this.apollo.mutate(
      {
        /** Mutation Query */
        mutation: gql`
          mutation getContact($contact: ContactInput) {
            getContact(contact: $contact) {
              name
              email
              subject
              description
            }
          }
        `,
        variables: {
          contact: formFieldObject
        },
      }
    ).pipe(
      map((p: any) => {
        return p.data.getContact;
      }),
    );
    }

    addContact(contact: any): Observable<Contact> {
      return this.apollo.mutate({
        mutation: gql`
          mutation addContact($contact: ContactInput) {
            addContact(contact: $contact) {
              ...Contact
            }
          }
          ${this.contactFileds}
        `,
        variables: {
          contact
        }
      }).pipe(
        map((q: any) => q.data.addContact)
      );
    }


    redirectToCompanyDetails(companyId: string, view = 'home') {
      this.router.navigate(['/', 'dashboard']);
    }

}