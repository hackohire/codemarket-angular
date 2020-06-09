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
  
  getCsvFileData(data: any, createdBy: String, fileName: String, label: String, companies: Batch): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation getCsvFileData($data: [JSON], $createdBy: String, $fileName: String, $label: String, $companies: batchInput) {
            getCsvFileData(data: $data, createdBy: $createdBy, fileName: $fileName, label: $label, companies: $companies) {
              data
              createdBy
              fileName
              label
              companies {
                _id
                name
              }
            }
          }
        `,
        variables: {
          data,
          createdBy,
          fileName,
          label,
          companies
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCsvFileData;
      }),
    );
  }

  getEmailData(batches: Batch, emailTemplate: String, subject: String, createdBy: String, from: String, companies: Batch): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation getEmailData($batches: batchInput, $emailTemplate: String, $subject: String, $createdBy: String, $from: String, $companies: batchInput) {
            getEmailData(batches: $batches, emailTemplate: $emailTemplate, subject: $subject, createdBy: $createdBy, from: $from, companies: $companies) {
              batches {
                _id
                name
                campaignId
              }
              emailTemplate
              subject
              createdBy
              from
              companies {
                _id
                name
              }
            }
          }
        `,
        variables: {
          batches,
          emailTemplate,
          subject,
          createdBy,
          from,
          companies
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getEmailData;
      }),
    );;
  }
  
  saveCsvFileData(data: any, createdBy: String, fileName: String, label: String, companies: Batch): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation saveCsvFileData($data: [JSON], $createdBy: String, $fileName: String, $label: String, $companies: batchInput) {
            saveCsvFileData(data: $data, createdBy: $createdBy, fileName: $fileName, label: $label, companies: $companies) {
              data
              createdBy
              fileName
              label
              companies {
                _id
                name
              }
            }
          }
        `,
        variables: {
          data,
          createdBy,
          fileName,
          label,
          companies
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCsvFileData;
      }),
    );
  }

  getMailingList(companyId: string): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query getMailingList($companyId: String) {
            getMailingList(companyId: $companyId) {
              _id
              name
              createdBy {
                _id
                name
              }
            }
          }
        `,
        variables: {
          companyId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getMailingList;
      }),
    );
  }

  getMailingListContacts(pageOptions, batchId: string): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query getMailingListContacts($pageOptions: PageOptionsInput, $batchId: String) {
            getMailingListContacts(pageOptions: $pageOptions, batchId: $batchId) {
              total
              contacts {
                _id
                name
                email {
                  email
                  status
                }
                proposalName
                OrganizationName
                birthDate
                address
                website
                companyName
                url
                firstName
                lastName
                cityName
                name
                followers
                following
                posts
                instaProfileId
                batch
                descriptionHTML
                companyContactEmail
                conpanyContactPerson
                ownerName
              }
            }
          }
        `,
        variables: {
          pageOptions,
          batchId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getMailingListContacts;
      }),
    );
  }

  getCampaignData(pageOptions, companyId: string): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query getCampaignData($pageOptions: PageOptionsInput, $companyId: String) {
            getCampaignData(pageOptions: $pageOptions, companyId: $companyId) {
              total
              campaigns {
                _id
                name
                batchId
                label
                createdAt
                updatedAt
              }
            }
          }
        `,
        variables: {
          pageOptions,
          companyId
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCampaignData;
      }),
    );
  }
}