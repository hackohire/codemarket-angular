import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state/app.state';
import { AuthService } from 'src/app/core/services/auth.service';
import { selectCartListLength } from '../../store/selectors/cart.selectors';
import { Router } from '@angular/router';
import { MatDialog, MatAnchor, MatDrawer } from '@angular/material';
import { SearchComponent } from '../search/search.component';
import { PostType } from '../../../shared/models/post-types.enum';
import { MessageService } from '../../../shared/services/message.service';
import { PostService } from '../../../shared/services/post.service';
import { appConstants } from '../../../shared/constants/app_constants';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {

  @ViewChild('lr', {static: false}) lr: MatAnchor;
  @ViewChild('drawer', { static: false }) drawer: MatDrawer;
  postTypes = PostType;

  postTypesArray = appConstants.postTypesArray;

  signUpConfig = {
    // header: 'My Customized Sign Up',
    hideAllDefaults: true,
    signUpFields: [
      {
        label: 'Name',
        key: 'name',
        required: true,
        displayOrder: 1,
        type: 'string'
      },
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 2,
        type: 'string',
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 3,
        type: 'password'
      },
    ]
  };
  loggedInUser: User;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
  );

  cartListLength: Observable<number>;

  private subscription: Subscription = new Subscription();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    public messageService: MessageService,
    public postService: PostService
    ) {
  }

  /** Load the Login/ Register popover on the page automatically if user is not loggedin */
  async ngAfterViewInit() {

    this.subscription.add(
      this.authService.openAuthenticationPopover.subscribe(open => {
        if (open) {
         this.lr._elementRef.nativeElement.click();
        }
      })
    );

    // if (await this.authService.checkIfUserIsLoggedIn()) {

    // } else {
    //   setTimeout(() => {
    //     this.lr._elementRef.nativeElement.click();
    //   }, 2000);
    // }
  }

  ngOnInit() {
    this.subscription.add(
      this.authService.loggedInUser$.subscribe(u => {
        if (u) {
          // this.ref.detach();
          this.loggedInUser = {...u};
          // this.ref.detectChanges();
        } else {
          this.loggedInUser = u;
        }

      })
    );

    this.cartListLength = this.store.select(selectCartListLength);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  login() {
      // const dialogRef = this.dialog.open(AuthDialogComponent, {
      //   // panelClass: 'no-padding',
      // });

      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed');
      // });
    // this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  redirect() {
    this.router.navigate(['/']);
  }

  isUnread(messages) {
    return messages.find(m => m.__show);
  }

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(SearchComponent, {
      panelClass: 'no-padding',
      disableClose: false
    });
  }
  toggleNavbar() {
    this.drawer.toggle();
  }
}
