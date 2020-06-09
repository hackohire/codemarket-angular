import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private apollo: Apollo,
    @Inject(PLATFORM_ID) private platformId,
  ) { }

  createToken(identity: string): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query createdToken($identity: String) {
            createdToken(identity: $identity) {
              token,
              identity
            }
          }
        `,
        variables: {
          identity
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.createdToken;
      }),
    );
  }

  createVideoToken(identity: string): Observable<any> {
    return this.apollo.query(
      {
        query: gql`
          query createVideoToken($identity: String) {
            createVideoToken(identity: $identity) {
              token,
              identity
            }
          }
        `,
        variables: {
          identity
        },
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map((p: any) => {
        return p.data.createVideoToken;
      }),
    );
  }

  
}
