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

@Injectable()
export class CompanyService {

  companyFileds = gql`
  fragment Company on Company {
    _id
    name
    type
    cover
    cities {
      name
      _id
    }
    description {
      ...Description
    }
    ideas {
      ...Description
    }
    questions {
      ...Description
    }
    status
    createdAt
    updatedAt
    createdBy {
      _id
      name
      avatar
    }
    location {
      longitude
      latitude
      address
    }
    posts {
      description {
        ...Description
      }
      createdBy {
        _id
        avatar
        name
      }
      createdAt
      updatedAt
      challengeType
      postType
      _id
      comments {
        ...Comment
      }
    }
  }
  ${description}
  ${comment}
  `;

  companyQuery: QueryRef<any>;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private commentService: CommentService
  ) { }

  addCompany(company: Company): Observable<Company> {
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

  updateCompany(company: Company, operation = null): Observable<Company> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateCompany($company: CompanyInput, $operation: operation) {
            updateCompany(company: $company, operation: $operation) {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        variables: {
          company,
          operation
        }
      }
    ).pipe(
      map((p: any) => p.data.updateCompany),
    );
  }

  /** On Adding Challenges, listen Realtime  */
  onCompanyUpdate(company: Company) {
    const COMPANY_SUBSCRIPTION = gql`
    subscription onCompanyUpdate($companyId: String) {
      onCompanyUpdate(companyId: $companyId){
        companyUpdated {
          ...Company
        }
      }
    }
    ${this.companyFileds}
    `;

    this.companyQuery.subscribeToMore({
      document: COMPANY_SUBSCRIPTION,
      variables: { companyId: company._id },
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }

        // company = subscriptionData.data.onCompanyUpdate.companyUpdated;
        const newFeedItem = subscriptionData.data.onCompanyUpdate.companyUpdated;

        return {
          ...prev,
          onCompanyUpdate: {
            companyUpdated: newFeedItem
          }
        };
      }
      
    });
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


  getCompaniesByType(companyType: string): Observable<Company[]> {
    return this.apollo.query(
      {
        query: gql`
          query getCompaniesByType($companyType: String) {
            getCompaniesByType(companyType: $companyType) {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        variables: {
          companyType
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getCompaniesByType;
      }),
    );
  }

  getCompanyById(CompanyId: string): Observable<Company> {

    this.companyQuery = this.apollo.watchQuery(
      {
        query: gql`
          query getCompanyById($CompanyId: String) {
            getCompanyById(companyId: $CompanyId) {
              ...Company
            }
          }
          ${this.companyFileds}
        `,
        // fetchPolicy: 'no-cache',
        variables: {
          CompanyId
        }
      }
    );
    return this.companyQuery.valueChanges.pipe(
      map((p: any) => {
        return p.data.getCompanyById;
      }),
      /** On the first time fetching companydata, subscribe to liste company edit changes */
      concatMap((value, index) => {
        this.commentService.companyPostsList = value.posts;
        return index === 0 ? 
          of(value).pipe(tap(() => {
            this.onCompanyUpdate(value);
            this.commentService.onCommentAdded(value, []);
            this.commentService.onCommentUpdated(value, []);
            this.commentService.onCommentDeleted(value, []);
          })) : 
          of(value)
      })
    )
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

  redirectToCompanyDetails(companyId: string) {
    this.router.navigate(['/', `company`, companyId],
      { queryParams: { type: 'company' } });
  }

  editCompany(company: Company) {
    this.router.navigate(['/', 'company', 'edit-company', company._id],
      { queryParams: { type: company.type } });
  }
}
