import { Component, OnInit, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { UserService } from '../user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material';
import { AuthService } from '../core/services/auth.service';
import { OnApproveData, OnApproveActions, OnCancelData, OnErrorData } from '../core/paypal/types/buttons';
import { OnApprove, PayPalProcessor } from '../core/paypal/paypal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
  providers: [{ provide: PayPalProcessor, useExisting: forwardRef(() => DonateComponent) }]
})
export class DonateComponent implements OnInit, OnApprove {

  @ViewChild('dropinContainer', { static: true }) dropinContainer: ElementRef;
  @ViewChild('button', { static: true }) button: ElementRef;

  width = 220;
  height = 35;
  shape = 'rect';
  color = 'gold';
  label = 'paypal';
  layout = 'vertical';

  order = null;

  userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  donationInsatance = null;

  donationAmount = 5;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {

  }

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
      // dropin.create({
      //   authorization: environment.braintree_client,
      //   container: '#dropin-container',
      //   card: {
      //     cardholderName: {
      //       required: true
      //     }
      //   },
      //   paypal: {
      //     flow: 'checkout',
      //     amount: this.donationAmount.toFixed(2),
      //     currency: 'USD'
      //   }
      // }, (createErr, instance) => {
      //   if (instance) {
      //     this.donationInsatance = instance;
      //   }
      // });

      this.order = {
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.donationAmount.toFixed(2)
          }
        }]
      };
    } else {
      this.order = null;
    }
  }

  donate(stepper: MatStepper) {
    this.donationInsatance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
      this.userService.createTransaction({
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

  onApprove(data: OnApproveData, actions: OnApproveActions) {

    console.log('Transaction Approved:', data);

    console.log(actions);
    // Captures the trasnaction
    return actions.order.capture().then(details => {

      this.userService.createTransaction({
        donorName: this.userForm.get('name').value,
        donorEmail: this.userForm.get('email').value,
        transaction: details,
      }).toPromise().then((u: any) => {
        console.log(u);
        if (u) {
          Swal.fire('Thank You!', '', 'success');
          this.router.navigate(['/']);
          Promise.resolve(u);
        } else {
          return Promise.reject('Transaction aborted by the server');
        }
      });
    });
  }

  onCancel(data: OnCancelData) {

    console.log('Transaction Cancelled:', data);
  }

  onError(data: OnErrorData) {

    console.log('Transaction Error:', data);
  }

}
