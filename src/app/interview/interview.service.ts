import { Injectable } from '@angular/core';
import { Interview } from '../shared/models/interview.model';
import { Observable } from 'rxjs';
import { HelpQuery } from '../shared/models/help-query.model';
import gql from 'graphql-tag';
import { description } from '../shared/constants/fragments_constatnts';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class InterviewService {

  constructor(
    private apollo: Apollo
  ) { }

  addInterview(interview: Interview): Observable<Interview> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addInterview($interview: InterviewInput) {
          addInterview(interview: $interview) {
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
        interview: interview
      }
    }).pipe(
      map(q => q.data.addInterview)
    );
  }
}
