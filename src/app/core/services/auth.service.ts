import { Injectable } from '@angular/core';
import Amplify, { Hub } from '@aws-amplify/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { CognitoUserSession, CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { SetLoggedInUser, Authorise } from '../store/actions/user.actions';
import { selectLoggedInUser } from '../store/selectors/user.selector';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInUser$: Observable<User>;
  loggedInUser: User;
  constructor(
    private apollo: Apollo,
    private store: Store<AppState>
    ) {

    this.loggedInUser$ = this.store.select(selectLoggedInUser);
    this.loggedInUser$.subscribe((u) => this.loggedInUser = u);

    /** Hub listening for auth state changes */
    Hub.listen('auth', (data) => {
      const { channel, payload } = data;
      const state = {
        state: payload.event,
        user: payload.data
      };
      console.log('Hub', data);
      if (channel === 'auth' && data.payload.event === 'signIn') {

        Auth.currentAuthenticatedUser()
        .then((user: CognitoUser) => {
          console.log(user.getSignInUserSession().getIdToken().getJwtToken());
  
          const idToken = user.getSignInUserSession().getIdToken().getJwtToken();
          if (idToken) {
            this.setIdTokenToLocalStorage(idToken);
            if (!this.loggedInUser) {
              this.store.dispatch(new Authorise());
            }
            // this.authorizeWithPlatform();
          }
        })
        .catch(err => console.log(err));
      }
    });

    Auth.currentAuthenticatedUser()
      .then((user: CognitoUser) => {
        console.log(user.getSignInUserSession().getIdToken().getJwtToken());

        const idToken = user.getSignInUserSession().getIdToken().getJwtToken();
        if (idToken) {
          this.setIdTokenToLocalStorage(idToken);
          if (!this.loggedInUser) {
            this.store.dispatch(new Authorise());
          }
          // this.authorizeWithPlatform();
        }
      })
      .catch(err => console.log(err));
  }

  authorizeWithPlatform(): Observable<User> {
    return this.apollo.use('platform').mutate(
      {
        mutation: gql`
          mutation authorize($applicationId: String) {
            authorize(applicationId: $applicationId) {
              _id
              name
              email
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
    );
  }

  setIdTokenToLocalStorage(idToken: string): void {
    localStorage.setItem('idToken', idToken);
  }

  login(): void {
    // const config = Amplify.Auth._config;
    // const oauth = Amplify.Auth._config.oauth;
    // const url = `${environment.COGNITO_AUTH_DOMAIN}/login?response_type=${oauth.responseType}&client_id=${config.aws_user_pools_web_client_id}&redirect_uri=${oauth.redirectSignIn}`;
    // console.log(Amplify.Auth._config);
    // window.location.assign(url);
    Auth.federatedSignIn();
  }

  logout(): void {
    Auth.signOut().then(d => {
      console.log('user has been signed out');
      localStorage.clear();
    });
  }

  getLoggedInUser(): Observable<User> {
    return this.loggedInUser$;
  }
}
