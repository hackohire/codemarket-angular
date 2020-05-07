import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntlInputPhoneModule } from  'intl-input-phone';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmCodeComponent } from './confirm-code/confirm-code.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ConfirmCodeComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    IntlInputPhoneModule
  ],
  exports: [
    AuthComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ConfirmCodeComponent,
    ResetPasswordComponent,
  ]
})
export class AuthModule { }
