import { Component, OnInit, AfterViewChecked, AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import Amplify from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/models/user.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/state/app.state';
import { selectLoggedInUser } from '../../store/selectors/user.selector';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {

  loggedInUser: User;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    public authService: AuthService,
    private ref: ChangeDetectorRef
    ) {
  }

  ngOnInit() {
    this.authService.loggedInUser$.subscribe(u => {
      if (u) {
        // this.ref.detach();
        this.loggedInUser = {...u};
        this.ref.detectChanges();
      }

    });
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
