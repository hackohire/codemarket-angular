import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../user/user.service';
import dropin from 'braintree-web-drop-in';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  @ViewChild('dropinContainer', { static: true }) dropinContainer: ElementRef;
  @ViewChild('button', { static: true }) button: ElementRef;

  userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  donationInsatance = null;

  donationAmount = 5;
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.loggedInUser$.subscribe((u) => {
      if (u) {
        const name = this.userForm.get('name');
        const email = this.userForm.get('email');
        if (!name.value) {
          name.setValue(u.name);
        }
        if (!email.value) {
          email.setValue(u.email);
        }
      }
    });
  }

  stepIndexChanged(event) {
    console.log(event);
    if (event.selectedIndex === 1) {
      dropin.create({
        authorization: environment.braintree_client,
        container: '#dropin-container',
        card: {
          cardholderName: {
            required: true
          }
        },
        paypal: {
          flow: 'checkout',
          amount: this.donationAmount.toFixed(2),
          currency: 'USD'
        }
      }, (createErr, instance) => {
        if (instance) {
          this.donationInsatance = instance;
        }
      });
    }
  }

  donate(stepper: MatStepper) {
    this.donationInsatance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
      this.userService.createBraintreeTransaction({
        donorName: this.userForm.get('name').value,
        donorEmail: this.userForm.get('email').value,
        nonce: payload.nonce,
        amount: this.donationAmount.toFixed(2)
      }).toPromise().then((u: any) => {
        console.log(u);
        if (u.success) {
          Swal.fire('Thank You!', '', 'success');
          stepper.reset();
        }
      });
    });
  }

}
