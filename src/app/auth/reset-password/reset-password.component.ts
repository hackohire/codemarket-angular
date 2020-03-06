import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../notification.service';
import { LoaderService } from '../loader/loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import Auth from '@aws-amplify/auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  email = environment.confirm.email;
  
  resetPasswordForm = new FormGroup({
    code: new FormControl('', [ Validators.required, Validators.min(3) ]),
    password: new FormControl('', [ Validators.required, Validators.min(6) ])
  });

  hide = true;

  get codeInput() { return this.resetPasswordForm.get('code'); }
  get passwordInput() { return this.resetPasswordForm.get('password'); }

  constructor(
    public authService: AuthService,
    private _notification: NotificationService,
    private _loader: LoaderService,
  ) { }

  ngOnInit() {
  }

  getPasswordInputError() {
    if (this.passwordInput.hasError('required')) {
      return 'A password is required.';
    }
  }

  setPassword() {
    Auth.forgotPasswordSubmit(this.email, this.codeInput.value, this.passwordInput.value)
      .then((data: any) => {
        console.log(data);
        environment.confirm.password = this.passwordInput.value;
        if (environment.confirm.email && environment.confirm.password) {
          Auth.signIn(this.email, environment.confirm.password)
            .then(() => {
              this.authService._authState.next({state: 'signedId'});
              // this._router.navigate(['']);
            }).catch((error: any) => {
              this._notification.show(error.message);
              this.authService._authState.next({state: 'signIn'});
              // this._router.navigate(['auth/signin']);
            });
        }
      })
      .catch((error: any) => {
        console.log(error);
        this._notification.show(error.message);
      });
  }

  sendCodeAgainForResetPassword() {
    this._loader.show();
    this.authService.forgotPasswordRequest(this.email)
      .then((v) => {
        console.log(v);
        this._loader.hide();
        // this.authService._authState.next({state: 'resetPassword'});
      })
      .catch((error: any) => {
        this._loader.hide();
        this._notification.show(error.message);
      });
  }

}
