import { Injectable } from '@angular/core';
import { Email } from '../shared/models/email.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  emailQuery = gql`
    fragment Email on Email {
      _id
      createdAt
      updatedAt
      type
      status
      city
      createdBy {
        name
        _id
        avatar
        slug
      }
      to
      cc
      bcc
      subject
      descriptionHTML

      slug
    }
  `;

  postFields = gql`
  fragment Post on Post {
    _id
    name
    type
    phone
    email
  }`;

  constructor(
    private apollo: Apollo,
  ) { }

  sendEmail(email: Email) {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation sendEmail($email: EmailInput) {
            sendEmail(email: $email) {
              ...Email
            }
          }
          ${this.emailQuery}
        `,
        variables: {
          email
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.sendEmail;
      }),
    );
  }

  getPostsByType(postTye: string) {
    return this.apollo.query(
      {
        query: gql`
          query getPostsByType($postTye: String) {
            getPostsByType(postType: $postTye) {
              _id
              name
              type
              phone
              email
            }
          }
        `,
        variables: {
          postTye
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getPostsByType;
      }),
    );
  }
}
