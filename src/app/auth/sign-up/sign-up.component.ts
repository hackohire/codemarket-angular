import { Component, OnInit } from '@angular/core';
import { ConfigurationOptions, ContentOptionsEnum, CustomCountryModel } from 'intl-input-phone';
import { CountryCode, CountryCodes } from "./country-code";;
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
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
  configOption1 : ConfigurationOptions;
  selectedCountryList : CustomCountryModel[] = [];
  
  countryCodes: Array<CountryCode> = CountryCodes;
  searchText: string;

  selectedValue = "+1";
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.email, Validators.required ]),
    phone: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
    countryCode: new FormControl('', [ Validators.required ]),
    name: new FormControl('', [ Validators.min(2) ]),
  });

  get emailInput() { return this.signupForm.get('email'); }
  get phoneInput() { return this.signupForm.get('phone'); }
  get passwordInput() { return this.signupForm.get('password'); }
  get countryCodeInput() { return this.signupForm.get('countryCode'); }
  get nameInput() { return this.signupForm.get('name'); }

  constructor(
    public authService: AuthService,
    private _notification: NotificationService,
    private _loader: LoaderService,
    // private bottomSheetRef: MatBottomSheetRef<any>
  ) {
    this.selectedCountryList.push({ISOCode : "TE", Name : "TEST", CountryPhoneCode : "+39", CustomFlagUrl : "../assets/images.jpg", InputMasking : "999 999 9999"});
    this.configOption1 = new ConfigurationOptions();
    this.configOption1.SelectorClass = "WithBasic";
  }

  selectCountry(code: CountryCode) {
    // this.bottomSheetRef.dismiss(code);
  }

  ngOnInit() {
  }


  signUp() {
    this._loader.show();
    this.authService.signUp({
      email: this.emailInput.value,
      password: this.passwordInput.value,
      phone: this.countryCodeInput.value + this.phoneInput.value,
      name: this.nameInput.value,
    })
    .then((data) => {
      /** If signup successful, set the email & password in the environment to use it later */
      environment.confirm.email = this.emailInput.value;
      environment.confirm.password = this.passwordInput.value;
      environment.confirm.phone = this.phoneInput.value;
      /** By setting up, state to "confirmSignUp" => "ConfirCodeComponent" will be loaded*/
      this.authService._authState.next({ state: 'confirmSignUp' });
      this._loader.hide();
    })
    .catch((error) => {
      this._loader.hide();

      /** Will Log the error on bottom of the page */
      this._notification.show(error.message);
      switch (error.code) {
        /** This exception will be thrown if the user already tried registering before and user did not verify email id */
        case 'UserNotConfirmedException':
          environment.confirm.email = this.emailInput.value;
          environment.confirm.password = this.passwordInput.value;
          environment.confirm.phone = this.phoneInput.value;
          this.authService._authState.next({ state: 'confirmSignUp'});
          break;

        /** Uf user tries to register with already registered email id, this exception will be thrown, and user will be
         * redirected to signin page
         */
        case 'UsernameExistsException':
          this.authService._authState.next({ state: 'signIn', user: {email: this.emailInput.value, password: this.passwordInput.value}})
          break;
      }
    });
  }

}
