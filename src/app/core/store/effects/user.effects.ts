import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { switchMap, map, withLatestFrom, tap } from 'rxjs/operators/';
import { GetUser, EUserActions, GetUserSuccess, CreateUser, SetLoggedInUser, Authorise, UpdateUser } from '../actions/user.actions';
import { of } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { selectUserList } from '../selectors/user.selector';
import { UserService } from 'src/app/user/user.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable()
export class UserEffects {

    @Effect()
    getUser$ = this.actions$.pipe(
        ofType(GetUser),
        map(action => action.payload),
        tap(t => console.log(t)),
        withLatestFrom(this._store.pipe(select(selectUserList))),
        tap(t => console.log(t)),
        switchMap(([id, users]) => {
            console.log(users);
            const selectedUser = users.filter(user => user && user._id === id.toString())[0];
            return of(GetUserSuccess({payload: selectedUser}));
        })
    );

    @Effect()
    createUser$ = this.actions$.pipe(
        ofType(CreateUser),
        map(action => action.payload),
        switchMap((user) => this.userService.createUser(user)),
        switchMap((user: User) => of(SetLoggedInUser({payload: user})))
    );

    @Effect()
    updateUser$ = this.actions$.pipe(
        ofType(UpdateUser),
        map(action => action.payload),
        switchMap((user) => this.userService.updateUser(user)),
        switchMap((user: User) => of(SetLoggedInUser({payload: user})))
    );

    @Effect()
    authorize$ = this.actions$.pipe(
        ofType(EUserActions.Authorise),
        switchMap(() => this.authServie.authorizeWithPlatform()),
        tap((t) => console.log(t)),
        map((user: User) => SetLoggedInUser({payload: user}))
    );

    constructor(
        private actions$: Actions,
        private _store: Store<AppState>,
        private userService: UserService,
        private authServie: AuthService
    ) {

    }
}
