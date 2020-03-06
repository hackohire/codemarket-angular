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

  getEmailInputError() {
    if (this.emailInput.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    if (this.emailInput.hasError('required')) {
      return 'An Email is required.';
    }
  }

  getPasswordInputError() {
    if (this.passwordInput.hasError('required')) {
      return 'A password is required.';
    }
  }

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
            // this._router.navigate(['auth/signin']);
            break;
        }
      });
  }
}
