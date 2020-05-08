import { Component, OnInit, Inject } from '@angular/core';
import { MatButton, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import Auth from '@aws-amplify/auth';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.scss']
})
export class VerifyPhoneComponent implements OnInit {
 
  email = environment.confirm.email;
  phone = this.data.phone;

  confirmForm: FormGroup = new FormGroup({
    phone: new FormControl({value: this.data.phone, disabled: true}),
    code: new FormControl('', [ Validators.required, Validators.min(3) ])
  });
  
  get codeInput() { return this.confirmForm.get('code'); }

  constructor(
    public dialogRef: MatDialogRef<VerifyPhoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notification: NotificationService, 
    public authService: AuthService
  ) { }

  ngOnInit() {
    // this.confirmForm.get('phone').setValue(this.data.phone);
    // if (!this.email) {
    //   this.authService._authState.next(({state: 'signIn'}));
    // } else {
    //   Auth.resendSignUp(this.email);
    // }
  }

  confirmCode() {
  //   Auth.confirmSignUp(this.email, this.codeInput.value)
  //     .then((data: any) => {
  //       console.log(data);
  //       if (data === 'SUCCESS' &&
  //       environment.confirm.email &&
  //       environment.confirm.password) {
  //         Auth.signIn(this.email, environment.confirm.password)
  //           .then(() => {
  //             this.authService._authState.next({state: 'signedId'});
  //             // this._router.navigate(['']);
  //           }).catch((error: any) => {

  //             this.authService._authState.next({state: 'signIn'});
  //             // this._router.navigate(['auth/signin']);
  //           });
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.log(error);
  //       this._notification.show(error.message);
  //     });
  }

}
