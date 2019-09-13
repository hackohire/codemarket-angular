import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HelpQuery } from '../shared/models/help-query.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { description } from '../shared/constants/fragments_constatnts';
import { AuthService } from '../core/services/auth.service';
import { SetSelectedHelpRequest } from '../core/store/actions/help.actions';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  helpRequestQueryFields = gql`
  fragment HelpQuery on HelpQuery {
    _id
    name
    categories
    description {
      ...Description
    }
    shortDescription
    demo_url
    price
    status
    createdAt
    createdBy {
      name
      _id
      avatar
    }
    updatedAt
    tags {
      name
      _id
    }
    support {
      time
      description {
        ...Description
      }
    }
    likeCount
  }
  ${description}
  `;

  constructor(
    private apollo: Apollo,
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>
    ) { }

  getHelpRequestsByUserId(userId: string, status: string): Observable<HelpQuery[]> {
    return this.apollo.query(
      {
        query: gql`
          query getHelpRequestsByUserId($userId: String, $status: String) {
            getHelpRequestsByUserId(userId: $userId, status: $status) {
              ...HelpQuery
            }
          }
          ${this.helpRequestQueryFields}
        `,
        variables: {
          userId: userId,
          status: status
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getHelpRequestsByUserId;
      }),
    );
  }

  getAllHelpRequests(): Observable<HelpQuery[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllHelpRequests {
            getAllHelpRequests {
              ...HelpQuery
            }
          }
          ${this.helpRequestQueryFields}
        `,
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllHelpRequests;
      }),
    );
  }

  getHelpRequestById(helpRequestId: string): Observable<HelpQuery> {
    return this.apollo.query(
      {
        query: gql`
          query getHelpRequestById($helpRequestId: String) {
            getHelpRequestById(helpRequestId: $helpRequestId) {
              ...HelpQuery
            }
          }
          ${this.helpRequestQueryFields}
        `,
        variables: {
          helpRequestId: helpRequestId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getHelpRequestById;
      }),
    );
  }

  addQuery(helpQuery: HelpQuery): Observable<HelpQuery> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addQuery($helpQuery: HelpQueryInput) {
          addQuery(helpQuery: $helpQuery) {
            ...HelpQuery
          }
        }
        ${this.helpRequestQueryFields}
      `,
      variables: {
        helpQuery: helpQuery
      }
    }).pipe(
      map(q => q.data.addQuery)
    );
  }

  updateHelpRequest(helpRequest: HelpQuery): Observable<HelpQuery> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateHelpRequest($helpRequest: HelpQueryInput) {
            updateHelpRequest(helpRequest: $helpRequest) {
              ...HelpQuery
            }
          }
          ${this.helpRequestQueryFields}
        `,
        variables: {
          helpRequest: helpRequest
        }
      }
    ).pipe(
      map((p) => p.data.updateHelpRequest),
    );
  }

  deleteHelpRequest(helpRequestId: string): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deleteHelpRequest($helpRequestId: String) {
            deleteHelpRequest(helpRequestId: $helpRequestId)
          }
        `,
        variables: {
          helpRequestId: helpRequestId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteHelpRequest;
      }),
    );
  }

  redirectToHelpRequestDetails(helpRequest: HelpQuery): void {
    this.store.dispatch(SetSelectedHelpRequest({ helpRequest }));
    this.router.navigate(['/', { outlets: { main: ['dashboard', 'help-request-details', helpRequest._id] } }]);
  }

}
