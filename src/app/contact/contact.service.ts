import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private apollo: Apollo,
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
