import { Injectable } from '@angular/core';
import { Hub } from '@aws-amplify/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { ICredentials } from '@aws-amplify/core';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { variable } from '@angular/compiler/src/output/output_ast';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {

  constructor(private apollo: Apollo) {

    /** Hub listening for auth state changes */
    Hub.listen('auth', (data) => {
      const { channel, payload } = data;
      const state = {
        state: payload.event,
        user: payload.data
      };
      console.log('Hub', data);
      if (channel === 'auth') {
        Auth.currentAuthenticatedUser()
          .then(data => {
            console.log(data);

          })
          .catch(err => console.log(err));

        Auth.currentSession().then((session: CognitoUserSession) => {
          console.log(session.getIdToken().getJwtToken())
          const idToken = session.getIdToken().getJwtToken();

          if(idToken) {
            this.setIdTokenToLocalStorage(idToken);

            // this.authorizeWithPlatform();
          }

        });
        // this.amplifyService.authState().next(state);
      }
    });
    Auth.currentSession().then((session: CognitoUserSession) => {
      console.log(session.getIdToken().getJwtToken())
      const idToken = session.getIdToken().getJwtToken();
      this.setIdTokenToLocalStorage(idToken);

      this.authorizeWithPlatform();
    });
  }

  authorizeWithPlatform() {
    return this.apollo.use('platform').mutate(
      {
        mutation: gql`
          mutation authorize($applicationId: String) {
            authorize(applicationId: $applicationId) {
              _id
              applications {
                _id
              }
              roles
            }

          }`,
          variables: {
            applicationId: environment.applicationId
          }
      }
    ).pipe(
      map((d: any) => {
        // console.log('check', d);
        return d.data.authorize;
      }),
      catchError(e => of(e)),
    ).subscribe(d => console.log(d));
  }

  setIdTokenToLocalStorage(idToken: string) {
    localStorage.setItem('idToken', idToken);
  }
}
