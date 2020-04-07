import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Auth from '@aws-amplify/auth';
import { NotificationService } from '../notification.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-confirm-code',
  templateUrl: './confirm-code.component.html',
  styleUrls: ['./confirm-code.component.scss']
})
export class ConfirmCodeComponent implements OnInit {

  email = environment.confirm.email;
  confirmForm: FormGroup = new FormGroup({
    email: new FormControl({value: this.email, disabled: true}),
    code: new FormControl('', [ Validators.required, Validators.min(3) ])
  });
  
  get codeInput() { return this.confirmForm.get('code'); }

  constructor( private _notification: NotificationService, public authService: AuthService) { }

  ngOnInit() {
    if (!this.email) {
      this.authService._authState.next(({state: 'signIn'}));
    } else {
      Auth.resendSignUp(this.email);
    }
  }

  confirmCode() {
    Auth.confirmSignUp(this.email, this.codeInput.value)
      .then((data: any) => {
        console.log(data);
        if (data === 'SUCCESS' &&
        environment.confirm.email &&
        environment.confirm.password) {
          Auth.signIn(this.email, environment.confirm.password)
            .then(() => {
              this.authService._authState.next({state: 'signedId'});
              // this._router.navigate(['']);
            }).catch((error: any) => {

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

}
