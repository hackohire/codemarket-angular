import { Injectable } from '@angular/core';
import { Testing } from '../shared/models/testing.model';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../core/services/auth.service';
import { SetSelectedTesting } from '../core/store/actions/testing.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  testingQueryFields = gql`
  fragment Testing on Testing {
    _id
    name
    categories
    description {
      ...Description
    }
    price
    status
    createdAt
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
    createdBy {
      _id
      name
      avatar
    }
  }
  ${description}
  `;

  constructor(
    private apollo: Apollo,
    private auth: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) { }


  getTestingsByUserId(userId: string, status: string): Observable<Testing[]> {
    return this.apollo.query(
      {
        query: gql`
          query getTestingsByUserId($userId: String, $status: String) {
            getTestingsByUserId(userId: $userId, status: $status) {
              ...Testing
            }
          }
          ${this.testingQueryFields}
        `,
        variables: {
          userId: userId,
status: status
        },
        fetchPolicy:  'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getTestingsByUserId;
      }),
    );
  }


  getAllTestings(): Observable<Testing[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllTestings {
            getAllTestings {
              ...Testing
            }
          }
          ${this.testingQueryFields}
        `,
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllTestings;
      }),
    );
  }

  getTestingById(TestingId: string): Observable<Testing> {
    return this.apollo.query(
      {
        query: gql`
          query getTestingById($TestingId: String) {
            getTestingById(testingId: $TestingId) {
              ...Testing
            }
          }
          ${this.testingQueryFields}
        `,
        variables: {
          TestingId: TestingId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getTestingById;
      }),
    );
  }


  addTesting(testing: Testing): Observable<Testing> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addTesting($testing: TestingInput) {
          addTesting(testing: $testing) {
            ...Testing
          }
        }
        ${this.testingQueryFields}
      `,
      variables: {
        testing: testing
      }
    }).pipe(
      map(q => q.data.addTesting)
    );
  }

  updateTesting(testing: Testing): Observable<Testing> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateTesting($testing: TestingInput) {
            updateTesting(testing: $testing) {
              ...Testing
            }
          }
          ${this.testingQueryFields}
        `,
        variables: {
          testing: testing
        }
      }
    ).pipe(
      map((p) => p.data.updateTesting),
    );
  }

  deleteTesting(testingId: string): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deleteTesting($testingId: String) {
            deleteTesting(testingId: $testingId)
          }
        `,
        variables: {
          testingId: testingId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteTesting;
      }),
    );
  }

  redirectToTestingDetails(testing: Testing): void {
    this.store.dispatch(SetSelectedTesting({ testing }));
    this.router.navigate(['/', { outlets: { main: ['dashboard', 'testing-details', testing._id] } }]);
  }
}
