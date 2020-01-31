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
  }
  ${description}
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

  /** On Adding Post Related to the company, listen Realtime  */
  onCompanyPostChanges(company: Company) {
    const COMPANY_SUBSCRIPTION = gql`
    subscription onCompanyPostChanges($companyId: String) {
      onCompanyPostChanges(companyId: $companyId){
        postUpdated {
          ...Post
        }
        postAdded {
          ...Post
        }
        postDeleted {
          _id
        }
      }
    }
    ${appConstants.postQuery}
    `;

    this.apollo.subscribe({
      query: COMPANY_SUBSCRIPTION,
      variables: { companyId: company._id }
    }).pipe(
      tap((p: any) => {
        /** companyPostsList in the comment Service are mutable and hence we are mutating them here */
        const data = p.data.onCompanyPostChanges;
        if (data && data.postAdded) {
          this.commentService.companyPostsList.unshift(data.postAdded);
        } else if (data && data.postUpdated) {
          const postToBeUpdated = this.commentService.companyPostsList.find(post => post._id === data.postUpdated._id);
          postToBeUpdated['description'] = data.postUpdated.description;
          postToBeUpdated['__edit'] = false;
        } else if (data && data.postDeleted) {
          const i = this.commentService.companyPostsList.findIndex(post => post._id === data.postDeleted._id);
          this.commentService.companyPostsList.splice(i, 1);
        }
      })
    ).subscribe();
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


  getCompaniesByType(companyType: string, pageOptions = {pageNumber: 0, limit: 0}): Observable<any> {
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
        fetchPolicy: 'no-cache',
        variables: {
          CompanyId
        }
      }
    );
    return this.companyQuery.valueChanges.pipe(
      map((p: any) => {
        return p.data.getCompanyById;
      }),
      /** On the first time fetching companydata, subscribe to listen company edit changes */
      concatMap((value, index) => {
        return index === 0 ?
          of(value).pipe(tap(() => {
            this.onCompanyPostChanges(value);
            this.commentService.onCommentAdded(null, value, []);
            this.commentService.onCommentUpdated(null, value, []);
            this.commentService.onCommentDeleted(null, value, []);

            // if (companyPostId && commentId) {
            //   const post = value.posts.find(p => p._id === companyPostId);
            //   const comment = post.comments.find(c => c._id === commentId);
            //   if(comment) {
            //     this.commentService.scrollToComment(post.blocks, comment);
            //   }
            // }
          })) :
          of(value);
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
                currentJobDetails {
                  jobProfile
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

  redirectToCompanyDetails(companyId: string, view = 'home') {
    this.router.navigate(['/', `company`, companyId],
      { queryParams: { view } }
      );
  }

  editCompany(company: Company) {
    this.router.navigate(['/', 'company', 'edit-company', company._id],
      { queryParams: { type: company.type } });
  }
}
