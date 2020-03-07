import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CognitoUser } from '@aws-amplify/auth';
// import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification.service';
import { LoaderService } from '../loader/loader.service';
import { AuthService } from '../../core/services/auth.service';
// import { LoaderService } from 'src/app/loader/loader.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  signinForm: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.email, Validators.required ]),
    password: new FormControl('', [ Validators.required, Validators.min(6) ])
  });

  hide = true;

  get emailInput() { return this.signinForm.get('email'); }
  get passwordInput() { return this.signinForm.get('password'); }

  constructor(
    public auth: AuthService,
    private _notification: NotificationService,
    private _loader: LoaderService,
    ) { }

  /** If successful signin, do nothing
   * Otherwise, If UserNotConfirmedException error => set email & password in environment varibale which we will be using to varify email
   */
  signIn() {
    this._loader.show();
    this.auth.signIn(this.emailInput.value, this.passwordInput.value)
      .then((user: CognitoUser|any) => {
        this._loader.hide();
      })
      .catch((error: any) => {
        this._loader.hide();
        this._notification.show(error.message);
        switch (error.code) {
          case 'UserNotConfirmedException':
            environment.confirm.email = this.emailInput.value;
            environment.confirm.password = this.passwordInput.value;
            this.auth._authState.next({state: 'confirmSignUp'});
            break;
          case 'UsernameExistsException':
            break;
        }
      });
  }
}
