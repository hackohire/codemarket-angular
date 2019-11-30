import { Injectable, Optional, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import Amplify, { Logger, I18n } from '@aws-amplify/core';
import { AuthState } from 'aws-amplify-angular/dist/src/providers';
import {authDecorator} from 'aws-amplify-angular/dist/src/providers/auth.decorator'

@Injectable({
  providedIn: 'root'
})
export class AmplifyService {

  private _auth: any;
  // private _analytics: any;
  private _storage: any;
  // private _api: any;
  // private _cache: any;
  // private _pubsub: any;
  private _logger: any;
  private _xr: any;
  private _i18n: any;
  private _authState = new Subject<AuthState>();
  authStateChange$ = this._authState.asObservable();

  constructor(
    @Inject('modules')
    @Optional()
    private modules: any = {}
  ) {
    const source = modules || Amplify;

    authDecorator(this._authState, source.Auth);

    this._auth = source.Auth;
    // this._analytics = source.Analytics;
    this._storage = source.Storage;
    // this._api = source.API;
    // this._cache = source.Cache;
    // this._pubsub = source.PubSub;
    this._xr = source.XR;

    // i18n and logger instantiated by default (do not change)
    this._i18n = I18n;
    this._logger = Logger;
  }

  auth(): any {
    return this._auth;
  }
  // analytics(): any {
  //   return this._analytics;
  // }
  storage(): any {
    return this._storage;
  }
  // api(): any {
  //   return this._api;
  // }
  // cache(): any {
  //   return this._cache;
  // }
  // pubsub(): any {
  //   return this._pubsub;
  // }
  logger(name, level?): Logger {
    return new this._logger(name, level);
  }
  xr(): any {
    return this._xr;
  }
  i18n(): any {
    return this._i18n;
  }

  authState() {
    return this._authState;
  }
  setAuthState(state: AuthState) {
    this._authState.next(state);
  }
}
