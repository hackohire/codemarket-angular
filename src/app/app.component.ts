import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './core/store/state/app.state';
import { MatDialog } from '@angular/material';
import { UserService } from './user/user.service';
import { environment } from '../environments/environment';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { RouteHelperService } from './core/services/route-helper.service';
import { SeoService } from './core/services/seo.service';
import { appConstants } from './shared/constants/app_constants';
import { VideoChatComponent } from './video-chat/video-chat.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = appConstants.SEO.title;
  private subscription = new Subscription();
  constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(DOCUMENT) private document: any,
    private authService: AuthService,
    private store: Store<AppState>,
    public dialog: MatDialog,
    // private userService: UserService,
    private routeHelper: RouteHelperService,
    private seoService: SeoService,
    private userService: UserService
  ) {

    this.seoService.setTwitterSiteCreator(appConstants.SEO.title);
    this.seoService.setTwitterCard(appConstants.SEO.twitter_card_large);

    // const source = timer(1200000);

    // this.subscription.add(
    //   source.subscribe(val => {
    //     this.authService.checkIfUserIsLoggedIn();
    //     console.log('===========================================================', val);
    //   })
    // );

    this.authService.checkIfUserIsLoggedIn();

    /** Listen to the video call event */
    this.authService.videoChatActivityObservable$.subscribe(a => {
      if (a) {
        /** If user receives the call open video chat dialog */
        const videoDialog = this.dialog.open(VideoChatComponent, {
          minWidth: '100vw',
          height: '100vh',
          data: { post: a.post, loggedInUser: this.authService.loggedInUser, caller: a.caller, isCallReceiving: true },
          disableClose: true
        });
      }
    });
  }

  public ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      const bases = this.document.getElementsByTagName('base');

      if (bases.length > 0) {
        bases[0].setAttribute('href', environment.baseHref);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}


