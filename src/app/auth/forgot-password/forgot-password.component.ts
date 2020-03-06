import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../notification.service';
import { LoaderService } from '../loader/loader.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
  });

  get emailInput() { return this.forgotPasswordForm.get('email'); }

  constructor(
    public authService: AuthService,
    private _notification: NotificationService,
    private _loader: LoaderService,
  ) { }

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

  onSend() {
    this._loader.show();
    this.authService.forgotPasswordRequest(this.emailInput.value)
      .then((v) => {
        console.log(v);
        environment.confirm.email = this.emailInput.value;
        this._loader.hide();
        this.authService._authState.next({state: 'resetPassword'});
      })
      .catch((error: any) => {
        this._loader.hide();
        this._notification.show(error.message);
      });
  }

}
