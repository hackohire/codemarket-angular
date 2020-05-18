import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Hub } from '@aws-amplify/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map, catchError, tap } from 'rxjs/operators';
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
import { MessageService } from '../../shared/services/message.service';
import { NotificationService } from '../../auth/notification.service';
import Storage from '@aws-amplify/storage';

export interface NewUser {
  email: string;
  password: string;
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /** Authentication Related Variables */
  _authState: BehaviorSubject<CognitoUser|any> = new BehaviorSubject<CognitoUser|any>(null);
  authState: Observable<CognitoUser|any> = this._authState.asObservable();

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
    private readonly transferState: TransferState,
    private messageService: MessageService,
    private _notification: NotificationService
    // private commentService: CommentService
  ) {

    this.loggedInUser$ = this.store.select(selectLoggedInUser);
    this.loggedInUser$.subscribe((u) => this.loggedInUser = u);

    /** Hub listening for auth state changes */
    Hub.listen('auth', async (data) => {
      const { channel, payload } = data;
      console.log('Hub', data);
      if (channel === 'auth') {

        /** Setting the state to load the respective auth components  */
        this._authState.next({ state: payload.event });

        if (payload.event === 'signIn') {
          this.checkIfUserIsLoggedIn();
          this.router.navigate(['/', 'dashboard', 'my-profile']);
        } else if (payload.event === 'oAuthSignOut') {
          this.store.dispatch(SetLoggedInUser({ payload: null }));
        }
      }
    });
  }

  authorizeWithPlatform(): Observable<User> {
    /** Checks is transferState has passed the data & retrieves */
    const key = makeStateKey('authorizedUser');
    if (this.transferState.hasKey(key)) {
      const user = this.transferState.get(key, null);
      this.transferState.remove(key);
      if (user) {
        // this.setUserOnline(user);
      }
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
              slug
              currentJobDetails {
                jobProfile {
                  name
                  _id
                  type
                }
                company {
                  name
                  _id
                }
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
              cover
              roles
              likeCount
              createdAt
              stripeId
            }
          }`,
        variables: {
          applicationId: ''
        }
      }
    ).pipe(
      map((d: any) => {
        // console.log('check', d);
        /** Sets the data to transferState */
        if (isPlatformServer(this._platformId)) {
          this.transferState.set(key, d.data.authorize);
        }
        if (d && d.data && d.data.authorize) {
          // this.setUserOnline(d.data.authorize);
        }
        return d.data.authorize;
      }),
      catchError(e => of(e)),
    );
  }

  /** Authentication Related Methods Starts here */

  signUp(user: NewUser): Promise<CognitoUser|any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
      attributes: {
        email: user.email,
        name: user.name
      }
    });
  }

  signIn(username: string, password: string): Promise<CognitoUser|any> {
    return new Promise((resolve, reject) => {
      Auth.signIn(username, password)
      .then((user: CognitoUser|any) => {
        resolve(user);
      }).catch((error: any) => reject(error));
    });
  }

  forgotPasswordRequest(email: string): Promise<any> {
    return Auth.forgotPassword(email);
  }

  resendCode(email: string) {
    Auth.resendSignUp(email)
      .then(() => this._notification.show('A code has been emailed to you'))
      .catch(() => this._notification.show('An error occurred'));
  }

  /** Authentication Related Methods Ends here */

  setUserOnline(u: User) {
    const USER_SUBSCRIPTION = gql`
    subscription onUserOnline($user: UserInput) {
      onUserOnline(user: $user){
        onCommentAdded {
          ...Comments
        }
      }
    }
    ${comment}
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
        if (u.onCommentAdded) {

          /** Audio Notification */
          var audio = new Audio(appConstants.Notification);
          audio.play();
          this.messageService.addNewMessage(u.onCommentAdded);
          // this.openToastrNotification(u.post, u.onCommentAdded, true);
        }
      })
    )
      .subscribe(u => console.log(u));
  }

  // openToastrNotification(post, c: Comment, rediect = true) {
  //   const message = c.parentId ? 'has reaplied to a comment on the post you have liked/commented' : 'has commented on the post you have liked/commented'

  //   this.subscriptions$.add(
  //     this.toastrService.info(
  //       `<b>${c.createdBy.name}</b> ${message}  <br>
  //       <u>View</u>
  //       `
  //     ).onTap
  //       .pipe(take(1))
  //       .subscribe((d) => {

  //         if (rediect) {
  //           if (c.type === 'company') {
  //             this.router.navigate(['/', `company`, post._id],
  //               { queryParams: { type: 'company', commentId: c._id, companyPostId: c.postId  } });
  //           } else if(c.type === 'dream-job') {
  //             this.router.navigate(['/', 'dream-job', post.slug ? post.slug : ''], { queryParams: { type: post.type, commentId: c._id} })
  //           } else {
  //             this.router.navigate(['/',
  //               post.type === 'product' ? 'product' : 'post',
  //               post.slug ? post.slug : ''
  //             ],
  //               { queryParams: { type: post.type, commentId: c._id} });
  //           }
  //         }
  //       })
  //   );
  // }

  // scrollToComment(blocks: [], c: Comment) {
  //   /** If block specific comment, open the comment section for that block first */
  //   if (c.blockSpecificComment) {
  //     const b: any = blocks.find((b: any) => b._id === c.blockId);
  //     b['__show'] = true;
  //   }

  //   /** If block specific comment, wait for half second to open the comment section for that block first */
  //   if (isPlatformBrowser(this._platformId)) {
  //     setTimeout(() => {
  //       let el = this.document.getElementById(`${c._id}`);
  //       el.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'center' }); /** scroll to the element upto the center */
  //       el.style.outline = '2px solid #00aeef'; /** Highlighting the element */
  //     }, c.blockSpecificComment ? 500 : 0);
  //   }
  // }

  setIdTokenToLocalStorage(idToken: string): void {
    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem('idToken', idToken);
    }
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


  filePickerCallback(cb, value, meta) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    // input.setAttribute('accept', 'image/*');
    input.onchange = (f) => {
      console.log(f);
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileNameSplitArray = file.name.split('.');
        const fileExt = fileNameSplitArray.pop();
        const fileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;

        Storage.vault.put(fileName, file, {

          bucket: environment.fileS3Bucket,

          level: 'public',

          contentType: file.type,
        }).then((uploaded: any) => {
          console.log('uploaded', uploaded);
          cb(environment.s3FilesBucketURL + uploaded.key, { title: file.name });
        });
      };
    };
    input.click();
  }
}
