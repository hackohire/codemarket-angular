import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Hub } from '@aws-amplify/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, catchError, tap, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import Auth from '@aws-amplify/auth';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../store/state/app.state';
import { Authorise, SetLoggedInUser } from '../store/actions/user.actions';
import { selectLoggedInUser } from '../store/selectors/user.selector';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';
import { isPlatformBrowser, DOCUMENT, isPlatformServer } from '@angular/common';
import { comment } from '../../shared/constants/fragments_constatnts';
import { appConstants } from '../../shared/constants/app_constants';
import { Comment } from '../../shared/models/comment.model';
import { ToastrService } from 'ngx-toastr';
import { TransferState, makeStateKey } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedInUser$: Observable<User>;
  loggedInUser: User;
  openAuthenticationPopover = new BehaviorSubject<boolean>(false);
  subscriptions$ = new Subscription();
  constructor(
    private apollo: Apollo,
    private store: Store<AppState>,
    private router: Router,
    @Inject(PLATFORM_ID) private _platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private toastrService: ToastrService,
    private readonly transferState: TransferState
    // private commentService: CommentService
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
      } else if (channel === 'auth' && data.payload.event === 'oAuthSignOut') {
        // localStorage.clear();
        this.store.dispatch(SetLoggedInUser({ payload: null }));
        // this.router.navigate(['/']);
      }
    });
  }

  authorizeWithPlatform(): Observable<User> {
    /** Checks is transferState has passed the data & retrieves */
    const key = makeStateKey('authorizedUser');
    if (this.transferState.hasKey(key)) {
      const user = this.transferState.get(key, null);
      this.transferState.remove(key);
      this.setUserOnline(user);
      return of(user);
    }
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
              subscription {
                plan {
                  nickname
                  amount
                  id
                }
                quantity
                id
                _id
                status
              }
              programming_languages
              avatar
              roles
              likeCount
              createdAt
              stripeId
              businessAreaInterests {
                name
                _id
              }
              leadershipAreaInterests {
                name
                _id
              }
              socialImpactInterests {
                name
                _id
              }
            }
          }`,
        variables: {
          applicationId: environment.applicationId
        }
      }
    ).pipe(
      map((d: any) => {
        // console.log('check', d);
        /** Sets the data to transferState */
        if (isPlatformServer(this._platformId)) {
          this.transferState.set(key, d.data.authorize);
        }
        this.setUserOnline(d.data.authorize);
        return d.data.authorize;
      }),
      catchError(e => of(e)),
    );
  }

  setUserOnline(u: User) {
    const USER_SUBSCRIPTION = gql`
    subscription onUserOnline($user: UserInput) {
      onUserOnline(user: $user){
        onCommentAdded {
          ...Comment
        }
        post {
          ...Post
        }
      }
    }
    ${comment}
    ${appConstants.postQuery}
    `;
    this.apollo.subscribe({
      query: USER_SUBSCRIPTION,
      variables: {
        user: {
          name: u.name,
          _id: u._id,
          avatar: u.avatar
        }
      }
    }).pipe(
      map((u: any) => u.data.onUserOnline),
      tap((u) => {
        if (u.onCommentAdded && u.post) {

          this.openToastrNotification(u.post, u.onCommentAdded, true)
        }
      })
    )
      .subscribe(u => console.log(u));
  }

  openToastrNotification(post, c: Comment, rediect = true) {
    const message = c.parentId ? 'has reaplied to a comment on the post you have liked/commented' : 'has commented on the post you have liked/commented'

    this.subscriptions$.add(
      this.toastrService.info(
        `<b>${c.createdBy.name}</b> ${message}  <br>
        <u>View</u>
        `
      ).onTap
        .pipe(take(1))
        .subscribe((d) => {
          if (rediect) {
            this.router.navigate(['/',
              post.type === 'product' ? 'product' : 'post',
              post.slug ? post.slug : ''
            ],
              { queryParams: { type: post.type, commentId: c._id } });
          }
        })
    );
  }

  scrollToComment(blocks: [], c: Comment) {
    /** If block specific comment, open the comment section for that block first */
    if (c.blockSpecificComment) {
      const b: any = blocks.find((b: any) => b._id === c.blockId);
      b['__show'] = true;
    }

    /** If block specific comment, wait for half second to open the comment section for that block first */
    if (isPlatformBrowser(this._platformId)) {
      setTimeout(() => {
        let el = this.document.getElementById(`${c._id}`);
        el.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'center' }); /** scroll to the element upto the center */
        el.style.outline = '2px solid #00aeef'; /** Highlighting the element */
      }, c.blockSpecificComment ? 500 : 0);
    }
  }

  setIdTokenToLocalStorage(idToken: string): void {
    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem('idToken', idToken);
    }
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
      if (isPlatformBrowser(this._platformId)) {
        localStorage.clear();
      }
      this.store.dispatch(SetLoggedInUser({ payload: null }));
      this.router.navigate(['/']);
    });
  }

  getLoggedInUser(): Observable<User> {
    return this.loggedInUser$;
  }

  checkIfUserIsLoggedIn(redirect?: boolean): Promise<boolean> {
    return Auth.currentAuthenticatedUser().then((u: CognitoUser) => {
      console.log(u);
      console.log(u.getSignInUserSession().getIdToken().getJwtToken());
      if (!this.loggedInUser) {
        this.setIdTokenToLocalStorage(u.getSignInUserSession().getIdToken().getJwtToken());
        this.store.dispatch(Authorise());
      }

      /** Check if redirect URL is set */
      const redirectTo = sessionStorage.getItem('redirectURL');
      if (redirectTo) {

        /** If redirect URL is set, send the user to the redirect url */
        this.router.navigateByUrl(redirectTo);

        /** remove redirect url from session sotrage after redirection */
        sessionStorage.removeItem('redirectURL');
      }
      return true;
    }).catch(() => {
      return Auth.currentSession().then((session: CognitoUserSession) => {
        this.setIdTokenToLocalStorage(session.getIdToken().getJwtToken());
        this.store.dispatch(Authorise());
        return true;
      }).catch((r) => {
        console.log(r);
        if (isPlatformBrowser(this._platformId)) {
          localStorage.clear();
        }
        this.store.dispatch(SetLoggedInUser({ payload: null }));

        /** Checking if Auth Guard wants to redirect user to login */
        if (redirect) {

          /** If auth guard asks for redirect, then take the url tree for navigation after login, from getCurrentNavigation()
           * Otherwise take current URL
           */
          const redirectURLTree = this.router.getCurrentNavigation() ?
            this.router.getCurrentNavigation().extractedUrl.toString() : this.router.url;
          console.log(redirectURLTree);
          sessionStorage.setItem('redirectURL', redirectURLTree);
          this.openAuthenticationPopover.next(true);
          // this.login();
        }
        return false;
      });
    });
  }
}
