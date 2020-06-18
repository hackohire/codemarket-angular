import { Injectable, EventEmitter } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/internal/operators/map';
@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  invokeAppointmentDateTime = new EventEmitter();
  subsVar: Subscription;

  constructor(
    private apollo: Apollo
  ) { }

  onCalanderDateSelectClick(date: any) {
    this.invokeAppointmentDateTime.emit(date);
  }

  bookSession(post, actionBy): Observable<any> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation bookSession($post: PostInput, $actionBy: String) {
            bookSession(post: $post, actionBy: $actionBy)
          }
        `,
        variables: {
          post,
          actionBy
        },
      }
    ).pipe(
      map((p: any) => {
        return p.data.bookSession;
      }),
    );
  }
}
