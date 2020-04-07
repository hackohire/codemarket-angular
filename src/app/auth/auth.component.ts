import { Component, OnInit, NgZone, Input, OnDestroy } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Subscription } from 'rxjs';

export interface AuthState {
  state: string;
  user: any;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  /** Initial State */
  authState: AuthState = {
    state: 'signIn',
    user: null,
  };

  subscription = new Subscription();

  constructor(
    public authService: AuthService
  ) {
    /** Listent to the state events and render the components based on that */
    this.subscription.add(
      this.authService._authState.subscribe((state) => {
        if (state) {
          this.authState = state;
        }
      })
    );
  }

  ngOnInit() {
  }

  /** Remove Subscription on Componen destroy */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
