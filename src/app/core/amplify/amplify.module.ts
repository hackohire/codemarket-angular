/*
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DynamicComponentDirective } from './directives/dynamic.component.directive';

// tslint:disable:max-line-length

import { AuthenticatorComponent } from './authenticator/authenticator.factory';
import { AuthenticatorComponentCore } from './authenticator/authenticator.component.core';
import { ConfirmSignInComponent } from './confirm-sign-in-component/confirm-sign-in.factory';
import { ConfirmSignInComponentCore } from './confirm-sign-in-component/confirm-sign-in-component.core';
import { ConfirmSignUpComponent } from './confirm-sign-up-component/confirm-sign-up.factory';
import { ConfirmSignUpComponentCore } from './confirm-sign-up-component/confirm-sign-up.component.core';
import { SignInComponent } from './sign-in-component/sign-in.component.factory';
import { SignInComponentCore } from './sign-in-component/sign-in.component.core';
import { SignUpComponent } from './sign-up-component/sign-up.factory';
import { SignUpComponentCore } from './sign-up-component/sign-up.component.core';
import { RequireNewPasswordComponent } from './require-new-password-component/require-new-password.factory';
import { RequireNewPasswordComponentCore } from './require-new-password-component/require-new-password.component.core';
import { GreetingComponent } from './greeting-component/greeting.factory';
import { GreetingComponentCore } from './greeting-component/greeting.component.core';
import { ForgotPasswordComponent } from './forgot-password-component/forgot-password.factory';
import { ForgotPasswordComponentCore } from './forgot-password-component/forgot-password.component.core';
import { UsernameFieldComponentCore } from './username-field-component/username-field.component.core';
import { PhoneFieldComponentCore } from './phone-field-component/phone-field.component.core';


import { FormComponent } from './form.component';
// tslint:enable:max-line-length

const components = [
	AuthenticatorComponent,
	AuthenticatorComponentCore,
	ConfirmSignInComponent,
	ConfirmSignInComponentCore,
	ConfirmSignUpComponent,
	ConfirmSignUpComponentCore,
	SignInComponent,
	SignInComponentCore,
	SignUpComponent,
	SignUpComponentCore,
	RequireNewPasswordComponent,
	RequireNewPasswordComponentCore,
	GreetingComponent,
	GreetingComponentCore,
	ForgotPasswordComponent,
	ForgotPasswordComponentCore,
	UsernameFieldComponentCore,
	PhoneFieldComponentCore,
	FormComponent,
];

@NgModule({
	imports: [CommonModule, FormsModule],
	declarations: [DynamicComponentDirective, ...components],
	entryComponents: [...components],
	providers: [],
	exports: [...components],
})

export class AmplifyModule { }
