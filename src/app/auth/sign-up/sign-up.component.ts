import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../notification.service';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  hide = true;
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.email, Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
    name: new FormControl('', [ Validators.min(2) ]),
  });

  get emailInput() { return this.signupForm.get('email'); }
  get passwordInput() { return this.signupForm.get('password'); }
  get nameInput() { return this.signupForm.get('name'); }

  constructor(
    public authService: AuthService,
    private _router: Router,
    private _notification: NotificationService,
    private _loader: LoaderService,
  ) {}

  ngOnInit() {
  }

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

  shouldEnableSubmit() {
    return !this.emailInput.valid || !this.passwordInput.valid || !this.nameInput.valid;
  }

  signUp() {
    this._loader.show();
    this.authService.signUp({
      email: this.emailInput.value,
      password: this.passwordInput.value,
      name: this.nameInput.value,
    })
    .then((data) => {
      environment.confirm.email = this.emailInput.value;
      environment.confirm.password = this.passwordInput.value;
      this.authService._authState.next({ state: 'confirmSignUp' });
      this._loader.hide();
    })
    .catch((error) => {
      this._loader.hide();
      this._notification.show(error.message);
      switch (error.code) {
        case 'UserNotConfirmedException':
          environment.confirm.email = this.emailInput.value;
          environment.confirm.password = this.passwordInput.value;
          this.authService._authState.next({ state: 'confirmSignUp'});
          break;
        case 'UsernameExistsException':
          this.authService._authState.next({ state: 'signIn', user: {email: this.emailInput.value, password: this.passwordInput.value}})
          break;
      }
    });
  }

}
