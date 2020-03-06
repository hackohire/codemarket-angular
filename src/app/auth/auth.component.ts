import { Component, OnInit, NgZone, Input, OnDestroy } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { Router } from '@angular/router';
import { Hub } from '@aws-amplify/core';
import { AuthService } from '../core/services/auth.service';
import { Subscription } from 'rxjs';
import { auth } from '../core/amplify/assets/data-test-attributes';

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
  authState: AuthState = {
    state: 'signIn',
    user: null,
  };

  subscription = new Subscription();

  @Input()
  hide: string[] = [];

  constructor(
    public authService: AuthService
  ) {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
