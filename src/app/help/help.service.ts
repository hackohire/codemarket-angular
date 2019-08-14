import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HelpQuery } from '../shared/models/help-query.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { description } from '../shared/constants/fragments_constatnts';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor(private apollo: Apollo) { }

  addQuery(helpQuery: HelpQuery): Observable<HelpQuery> {
    return this.apollo.mutate({
      mutation: gql`
        mutation addQuery($helpQuery: HelpQueryInput) {
          addQuery(helpQuery: $helpQuery) {
            _id
            question
            categories
            description {
                ...Description
            }
            shortDescription
            demo_url
            video_url
            documentation_url
            price
            status
            createdAt
            updatedAt
            snippets {
              language
            }
          }
        }
        ${description}
      `,
      variables: {
        helpQuery: helpQuery
      }
    }).pipe(
      map(q => q.data.addQuery)
    );
  }
}
