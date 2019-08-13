import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { HelpQuery } from '../shared/models/help-query.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor(private apollo: Apollo) { }

  addQuery(helpQuery: HelpQuery): Observable<HelpQuery> {
    const codeFragment = gql`
      fragment Code on CodeBlock {
        type
        data {
          code
          language
        }
      }
    `;

    const imageFragment = gql`
    fragment Image on ImageBlock {
      type
      data {
        caption
        file {
          url
        }
        stretched
        withBackground
        withBorder
      }
    }
  `;
    return this.apollo.mutate({
      mutation: gql`
        mutation addQuery($helpQuery: HelpQueryInput) {
          addQuery(helpQuery: $helpQuery) {
            _id
            question
            categories
            description {
                ...Code
                ...Image
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
        ${codeFragment}
        ${imageFragment}
      `,
      variables: {
        helpQuery: helpQuery
      }
    }).pipe(
      map(q => q.data.addQuery)
    );
  }
}
