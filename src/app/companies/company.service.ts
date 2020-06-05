import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { description, comment } from '../shared/constants/fragments_constatnts';
import { Company } from '../shared/models/company.model';
import { Observable, of } from 'rxjs';
import { map, concatMap, tap } from 'rxjs/operators';
import { Apollo, QueryRef } from 'apollo-angular';
import { Router } from '@angular/router';
import { CommentService } from '../shared/services/comment.service';
import { appConstants } from '../shared/constants/app_constants';

@Injectable({ providedIn: 'root' })
export class CompanyService {

  companyFileds = gql`
  fragment Company on Company {
    _id
    name
    type
    cover
    slug
    cities {
      name
      _id
    }
    owners {
      name
      avatar
      slug
      _id
    }
    status
    createdAt
    updatedAt
    createdBy {
      _id
      name
      avatar
      slug
    }
    location {
      longitude
      latitude
      address
    }
    facebookLink
    instagramLink
    twitterLink
    yelpLink
    linkedinLink
    websiteLink
  }
  `;

  companyQuery: QueryRef<any>;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private commentService: CommentService
  ) { }

  addCompany(company: any): Observable<Company> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addCompany($company: CompanyInput) {
          addCompany(company: $company) {
            ...Company
          }
        }
        ${this.companyFileds}
      `,
      variables: {
        company
      }
    }).pipe(
      map((q: any) => q.data.addCompany)
    );
  }

  updateCompany(company: Company): Observable<Company> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateCompany($company: CompanyInput) {
            updateCompany(company: $company) {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        variables: {
          company
        }
      }
    ).pipe(
      map((p: any) => p.data.updateCompany),
    );
  }

  getCompaniesByUserIdAndType(userId: string, companyType: string): Observable<Company[]> {
    return this.apollo.query(
      {
        query: gql`
          query getCompaniesByUserIdAndType($userId: String, $companyType: String) {
            getCompaniesByUserIdAndType(userId: $userId, companyType: $companyType) {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        variables: {
          userId,
          companyType
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCompaniesByUserIdAndType;
      }),
    );
  }


  getCompaniesByType(companyType: string, pageOptions = { pageNumber: 0, limit: 0 }): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query getCompaniesByType($companyType: String, $pageOptions: PageOptionsInput) {
            getCompaniesByType(companyType: $companyType, pageOptions: $pageOptions) {
              companies {
                ...Company
              }
              total
            }
          }
          ${this.companyFileds}
        `,
        variables: {
          companyType,
          pageOptions
        },
        // fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return pageOptions && pageOptions.limit ? p.data.getCompaniesByType : p.data.getCompaniesByType.companies;
      }),
    );
  }

  getCompanyById(slug: string): Observable<Company> {

    this.companyQuery = this.apollo.watchQuery(
      {
        query: gql`
          query getCompanyById($slug: String) {
            getCompanyById(slug: $slug) {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        fetchPolicy: 'no-cache',
        variables: {
          slug
        }
      }
    );
    return this.companyQuery.valueChanges.pipe(
      map((p: any) => {
        return p.data.getCompanyById;
      }),
      /** On the first time fetching companydata, subscribe to listen company edit changes */
      concatMap((company, index) => {
        return index === 0 ?
          of(company).pipe(tap(() => {
            // this.onCompanyPostChanges(company);
            this.commentService.onCommentAdded({ company }, []);
            this.commentService.onCommentUpdated({ company }, []);
            this.commentService.onCommentDeleted({ company }, []);
          })) :
          of(company);
      })
    );
  }

  deleteCompany(companyId: string): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deleteCompany($companyId: String) {
            deleteCompany(companyId: $companyId)
          }
        `,
        variables: {
          companyId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteCompany;
      }),
    );
  }

  getListOfUsersInACompany(companyId: string) {
    return this.apollo.query(
      {
        query: gql`
          query getListOfUsersInACompany($companyId: String) {
            getListOfUsersInACompany(companyId: $companyId) {
                name
                avatar
                _id
                currentJobDetails {
                  jobProfile {
                    name
                    _id
                    type
                  }
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
        return p.data.getListOfUsersInACompany;
      }),
    );
  }

  getEventsByCompanyId(companyId) {
    return this.apollo.query(
      {
        query: gql`
          query getEventsByCompanyId($companyId: String) {
            getEventsByCompanyId(companyId: $companyId) {
              ...Post
            }
          }
          ${appConstants.postQuery}
        `,
        variables: {
          companyId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getEventsByCompanyId;
      }),
    );
  }

  getCampaignsWithTracking(pageOptions, companyId, batchId = '') {
    return this.apollo.query(
      {
        query: gql`
          query getCampaignsWithTracking($pageOptions: PageOptionsInput, $companyId: String, $batchId: String) {
            getCampaignsWithTracking(pageOptions: $pageOptions, companyId: $companyId, batchId: $batchId) {
              _id
              name
              label
              descriptionHTML
              createdBy {
                name
                _id
                avatar
                slug
              }
              count
              emailData {
                _id
                to
                createdAt
                subject
                descriptionHTML
                isReplied
                repliedHTML
                tracking {
                  eventType
                  open {
                    timestamp
                    userAgent
                    ipAddress
                  }
                  mail {
                    timestamp
                    source
                    destination
                  }
                }
              }
            }
          }
        `,
        variables: {
          pageOptions,
          companyId,
          batchId
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCampaignsWithTracking;
      }),
    );
  }

  getCampaignEmails(pageOptions, campaignId) {
    return this.apollo.query({
      query: gql`
        query getCampaignEmails($pageOptions: PageOptionsInput, $campaignId: String) {
          getCampaignEmails(pageOptions: $pageOptions, campaignId: $campaignId) {
            emails {
              _id
              to
              createdAt
              subject
              descriptionHTML
              tracking {
                eventType
                open {
                  timestamp
                  userAgent
                  ipAddress
                }
                mail {
                  timestamp
                  source
                  destination
                }
              }
            }
            total
          }
        }
      `,
      variables: {
        pageOptions,
        campaignId: campaignId
      },
      fetchPolicy: 'no-cache'
    }).pipe(
      map((p: any) => {
        return p.data.getCampaignEmails;
      }),
    );
  }

  redirectToCompanyDetails(companyId: string, slug: string, view = 'posts') {
    this.router.navigate(['/', `company`, slug],
      { queryParams: { view, id: companyId } }
    );
  }

  editCompany(company: Company) {
    this.router.navigate(['/', 'company', 'edit-company', company._id],
      { queryParams: { type: company.type } });
  }
}
