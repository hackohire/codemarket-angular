import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Requirement } from '../shared/models/requirement.model';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { SetSelectedRequirement } from '../core/store/actions/requirement.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from '../core/store/state/app.state';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  requirementQueryFields = gql`
  fragment Requirement on Requirement {
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


  getRequirementsByUserId(userId: string, status: string): Observable<Requirement[]> {
    return this.apollo.query(
      {
        query: gql`
          query getRequirementsByUserId($userId: String, $status: String) {
            getRequirementsByUserId(userId: $userId, status: $status) {
              ...Requirement
            }
          }
          ${this.requirementQueryFields}
        `,
        variables: {
          userId: userId,
          status: status
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getRequirementsByUserId;
      }),
    );
  }



  getAllRequirements(): Observable<Requirement[]> {
    return this.apollo.query(
      {
        query: gql`
          query getAllRequirements {
            getAllRequirements {
              ...Requirement
            }
          }
          ${this.requirementQueryFields}
        `,
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.getAllRequirements;
      }),
    );
  }

  getRequirementById(RequirementId: string): Observable<Requirement> {
    return this.apollo.query(
      {
        query: gql`
          query getRequirementById($RequirementId: String) {
            getRequirementById(requirementId: $RequirementId) {
              ...Requirement
            }
          }
          ${this.requirementQueryFields}
        `,
        variables: {
          RequirementId: RequirementId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.getRequirementById;
      }),
    );
  }

  addRequirement(requirement: Requirement): Observable<Requirement> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addRequirement($requirement: RequirementInput) {
          addRequirement(requirement: $requirement) {
            ...Requirement
          }
        }
        ${this.requirementQueryFields}
      `,
      variables: {
        requirement: requirement
      }
    }).pipe(
      map(q => q.data.addRequirement)
    );
  }

  updateRequirement(requirement: Requirement): Observable<Requirement> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation updateRequirement($requirement: RequirementInput) {
            updateRequirement(requirement: $requirement) {
              ...Requirement
            }
          }
          ${this.requirementQueryFields}
        `,
        variables: {
          requirement: requirement
        }
      }
    ).pipe(
      map((p) => p.data.updateRequirement),
    );
  }

  deleteRequirement(requirementId: string): Observable<boolean> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation deleteRequirement($requirementId: String) {
            deleteRequirement(requirementId: $requirementId)
          }
        `,
        variables: {
          requirementId: requirementId
        }
      }
    ).pipe(
      map((p: any) => {
        return p.data.deleteRequirement;
      }),
    );
  }

  redirectToRequirementDetails(requirement: Requirement): void {
    this.store.dispatch(SetSelectedRequirement({ requirement }));
    this.router.navigate(['/', { outlets: { main: ['dashboard', 'requirement-details', requirement._id] } }]);
  }
}
