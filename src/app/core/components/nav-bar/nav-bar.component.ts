import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state/app.state';
import { AuthService } from 'src/app/core/services/auth.service';
import { selectCartListLength } from '../../store/selectors/cart.selectors';
import { Router } from '@angular/router';
import { MatDialog, MatAnchor } from '@angular/material';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  @ViewChild('lr', {static: false}) lr: MatAnchor;
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

  loggedInUserSubscription: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    public authService: AuthService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog
    ) {
  }

  /** Load the Login/ Register popover on the page automatically if user is not loggedin */
  async ngAfterViewInit() {


    if (await this.authService.checkIfUserIsLoggedIn()) {

    } else {
      setTimeout(() => {
        this.lr._elementRef.nativeElement.click();
      }, 2000)
    }
  }

  ngOnInit() {
    this.loggedInUserSubscription = this.authService.loggedInUser$.subscribe(u => {
      if (u) {
        // this.ref.detach();
        this.loggedInUser = {...u};
        this.ref.detectChanges();
      } else {
        this.loggedInUser = u;
      }

    });

    this.cartListLength = this.store.select(selectCartListLength);

  }

  ngOnDestroy() {
    this.loggedInUserSubscription.unsubscribe();
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

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(SearchComponent, {
      // width: '430px',
      // height: '550px',
      // maxHeight: '700px',
      panelClass: 'no-padding',
      // data: {plan},
      
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
