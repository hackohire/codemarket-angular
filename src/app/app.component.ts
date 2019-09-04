import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { timer } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from './core/store/state/app.state';
import { GetCartProductsList } from './core/store/actions/cart.actions';
import { switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'codemarket';
  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {

    const source = timer(0, 3000000);

    const subscribe = source.subscribe(val => this.authService.checkIfUserIsLoggedIn());

    this.authService.loggedInUser$.pipe(
      tap((u) => {
        if (u) {
          return this.store.dispatch(GetCartProductsList());
        }
      })
    ).subscribe();

  }
}


