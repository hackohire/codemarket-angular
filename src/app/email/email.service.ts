import { Injectable } from '@angular/core';
import { Email, Batch } from '../shared/models/email.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  
  getCsvFileData(data: any, createdBy: String, fileName: String): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation getCsvFileData($data: [JSON], $createdBy: String, $fileName: String) {
            getCsvFileData(data: $data, createdBy: $createdBy, fileName: $fileName) {
              data
              createdBy
              fileName
            }
          }
        `,
        variables: {
          data,
          createdBy,
          fileName
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCsvFileData;
      }),
    );
  }

  getEmailData(batches: Batch, emailTemplate: String, subject: String, createdBy: String): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation getEmailData($batches: batchInput, $emailTemplate: String, $subject: String, $createdBy: String) {
            getEmailData(batches: $batches, emailTemplate: $emailTemplate, subject: $subject, createdBy: $createdBy) {
              batches {
                _id
                name
                campaignId
              }
              emailTemplate
              subject
            }
          }
        `,
        variables: {
          batches,
          emailTemplate,
          subject,
          createdBy
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getEmailData;
      }),
    );;
  }
  
}