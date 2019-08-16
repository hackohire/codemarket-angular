import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Requirement } from '../shared/models/requirement.model';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';

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
  }
  ${description}
  `;


  constructor(
    private apollo: Apollo,
    private auth: AuthService
  ) { }


  getRequirementsByUserId(): Observable<Requirement[]> {
    return this.apollo.query(
      {
        query: gql`
          query getRequirementsByUserId($userId: String) {
            getRequirementsByUserId(userId: $userId) {
              ...Requirement
            }
          }
          ${this.requirementQueryFields}
        `,
        variables: {
          userId: this.auth.loggedInUser._id
        }
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
        `
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
            getRequirementById(RequirementId: $RequirementId) {
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
}
