import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Requirement } from '../shared/models/requirement.model';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  constructor(
    private apollo: Apollo
  ) { }

  addRequirement(requirement: Requirement): Observable<Requirement> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addRequirement($requirement: RequirementInput) {
          addRequirement(requirement: $requirement) {
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
        }
        ${description}
      `,
      variables: {
        requirement: requirement
      }
    }).pipe(
      map(q => q.data.addRequirement)
    );
  }
}
