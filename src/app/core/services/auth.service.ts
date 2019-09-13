import { Injectable } from '@angular/core';
import { Hub } from '@aws-amplify/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { Authorise, SetLoggedInUser } from '../store/actions/user.actions';
import { selectLoggedInUser } from '../store/selectors/user.selector';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInUser$: Observable<User>;
  loggedInUser: User;
  constructor(
    private apollo: Apollo,
    private store: Store<AppState>,
    private router: Router
    ) {

    this.loggedInUser$ = this.store.select(selectLoggedInUser);
    this.loggedInUser$.subscribe((u) => this.loggedInUser = u);

    /** Hub listening for auth state changes */
    Hub.listen('auth', async (data) => {
      const { channel, payload } = data;
      const state = {
        state: payload.event,
        user: payload.data
      };
      console.log('Hub', data);
      if (channel === 'auth' && data.payload.event === 'signIn') {
        this.checkIfUserIsLoggedIn();

        // Auth.currentAuthenticatedUser()
        // .then((user: CognitoUser) => {
        //   console.log(user.getSignInUserSession().getRefreshToken().getToken());

        //   const idToken = user.getSignInUserSession().getIdToken().getJwtToken();
        //   if (idToken) {
        //     this.setIdTokenToLocalStorage(idToken);
        //     if (!this.loggedInUser) {
        //       this.store.dispatch(Authorise());
        //     }
        //     // this.authorizeWithPlatform();
        //   }
        // })
        // .catch(err => {
        //   console.log(err);
        //   // localStorage.clear();
        //   this.store.dispatch(SetLoggedInUser({payload: null}));
        // });
      } else if (channel === 'auth' && data.payload.event === 'oAuthSignOut') {
        // localStorage.clear();
        this.store.dispatch(SetLoggedInUser({payload: null}));
        // this.router.navigate(['/']);
      }
    });

    // this.checkIfUserIsLoggedIn();

    // Auth.currentAuthenticatedUser()
    //   .then((user: CognitoUser) => {
    //     console.log(user.getSignInUserSession().getIdToken().getJwtToken());

    //     const idToken = user.getSignInUserSession().getIdToken().getJwtToken();
    //     if (idToken) {
    //       this.setIdTokenToLocalStorage(idToken);
    //       if (!this.loggedInUser) {
    //         this.store.dispatch(Authorise());
    //       }
    //       // this.authorizeWithPlatform();
    //     }
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     // this.router.navigate(['/']);
    //     this.store.dispatch(SetLoggedInUser({payload: null}));
    //     // localStorage.clear();
    //   });
  }

  authorizeWithPlatform(): Observable<User> {
    return this.apollo.mutate(
      {
        mutation: gql`
          mutation authorize($applicationId: String) {
            authorize(applicationId: $applicationId) {
              _id
              name
              email
              linkedin_url
              github_url
              stackoverflow_url
              location
              currentJobDetails {
                jobProfile
                companyName
                companyLocation
              }
              programming_languages
              avatar
              roles
              likeCount
              createdAt
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

  checkIfUserIsLoggedIn(redirect?: boolean): Promise<boolean> {
    return Auth.currentAuthenticatedUser().then((u: CognitoUser) => {
      console.log(u);
      if (!this.loggedInUser) {
        this.setIdTokenToLocalStorage(u.getSignInUserSession().getIdToken().getJwtToken());
        this.store.dispatch(Authorise());
      }
      return true;
    }).catch(() => {
      return Auth.currentSession().then((session: CognitoUserSession) => {
        this.setIdTokenToLocalStorage(session.getIdToken().getJwtToken());
        this.store.dispatch(Authorise());
        return true;
      }).catch((r) => {
        console.log(r);
        localStorage.clear();
        this.store.dispatch(SetLoggedInUser({payload: null}));

        if (redirect) {
          this.login();
        }
        return false;
      });
    });
  }
}
