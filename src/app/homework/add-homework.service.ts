import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddHomeworkService {

  constructor(
    private apollo: Apollo,
  ) { }

  /** Add Add-homework graphql API call to save the homework assignment
   * fields in the DB
   */
  addHomework(formFieldObject) {
    return this.apollo.mutate(
      {
        /** Mutation Query */
        mutation: gql`
          mutation addHomework($homework: HomeworkFieldsInput) {
            addHomework(homework: $homework) {
              assignmentNo
              title
              detailDescription
            }
          }
          `,
        variables: {
          homework: formFieldObject
        },
      }
    ).pipe(
      map((p: any) => {
        return p.data.addHomework;
      }),
    );
  }
}