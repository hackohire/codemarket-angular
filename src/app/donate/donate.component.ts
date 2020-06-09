import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
declare let paypal: any;

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
})
export class DonateComponent implements OnInit {

  width = 220;
  height = 35;
  shape = 'rect';
  color = 'gold';
  label = 'paypal';
  layout = 'vertical';



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
      this.loadPaypal();
    } else {
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

  private loadPaypal() {
    this.loadExternalScript(`https://www.paypal.com/sdk/js?client-id=${environment.paypal_client}&currency=USD`).then(() => {
      paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal',
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.donationAmount.toFixed(0)
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            console.log('Transaction completed by ' + details.payer.name.given_name + '!');
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
      }).render('#paypal-button-container');
    });
  }

  private loadExternalScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

  // onApprove(data: OnApproveData, actions: OnApproveActions) {

  //   console.log('Transaction Approved:', data);

  //   console.log(actions);
  //   // Captures the trasnaction
  //   return actions.order.capture().then(details => {

  //     this.userService.createTransaction({
  //       donorName: this.userForm.get('name').value,
  //       donorEmail: this.userForm.get('email').value,
  //       transaction: details,
  //     }).toPromise().then((u: any) => {
  //       console.log(u);
  //       if (u) {
  //         Swal.fire('Thank You!', '', 'success');
  //         this.router.navigate(['/']);
  //         Promise.resolve(u);
  //       } else {
  //         return Promise.reject('Transaction aborted by the server');
  //       }
  //     });
  //   });
  // }

  // onCancel(data: OnCancelData) {

  //   console.log('Transaction Cancelled:', data);
  // }

  // onError(data: OnErrorData) {

  //   console.log('Transaction Error:', data);
  // }

}
