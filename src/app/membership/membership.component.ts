import { Component, OnInit, ViewChild } from '@angular/core';
import { MembershipService } from './membership.service';
import { BreadCumb } from '../shared/models/bredcumb.model';
import { AuthService } from '../core/services/auth.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';
import { HttpClient } from '@angular/common/http';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { MatDialog } from '@angular/material';
import { SubscriptionDialogComponent } from './subscription-dialog/subscription-dialog.component';
import { SellingProductsService } from '../selling/selling-products.service';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
// declare var Stripe;
// declare var paypal;
declare var Stripe;

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.scss']
})
export class MembershipComponent implements OnInit {

  // Replace with your own public key: https://dashboard.stripe.com/test/apikeys
  PUBLIC_KEY = environment.stripe_public_key;
  // Replace with the domain you want your users to be redirected back to after payment
  DOMAIN = window.location.href;

  breadcumb: BreadCumb;
  listOfPlans = environment.planDetails;
  stripe;
  @ViewChild('successfulPayment', { static: false }) successfulPayment: SwalComponent;
  successfulPurchasedSubscription: any;
  sessionId: string;
  tabs = ['First', 'Second', 'Third'];
  selected = new FormControl(0);

  constructor(
    public membershipService: MembershipService,
    public authService: AuthService,
    public activatedRoute: ActivatedRoute,
    private sellingService: SellingProductsService,
    private dialog: MatDialog
  ) {
    this.breadcumb = {
      title: 'Subscription plans for bringing innovation to your business',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Membership'
        }
      ]
    };
  }

  ngOnInit() {

    this.stripe = Stripe(this.PUBLIC_KEY);

    /** Check for the session_id, if the session_id is there, fetch the session and show success sweetalert for product purchase */
    this.activatedRoute.queryParams.pipe(first()).toPromise().then((params) => {
      if (params.session_id) {
        this.sessionId = params.session_id;
        this.addTrnsaction();
        // this.http.post(environment.serverless_url + 'getCheckoutSession', { session_id: params.session_id, type: 'payment' }).toPromise().then((d: any) => {
        //   console.log(d);
        //   if (d) {
        //     this.successfulPurchasedProducts = d.session.data.object.display_items;
        //     this.successfulPayment.type = 'success';
        //     this.store.dispatch(GetCartProductsList());
        //     this.successfulPayment.show();
        //   }
        // })
      }
    });
  }

  async redirectToCheckout(plan, planType) {
    if (this.authService.loggedInUser) {
      if (this.authService.loggedInUser.subscription && this.authService.loggedInUser.subscription.length) {
        Swal.fire('Already Subscribed', 'You have already active subscription, Please contact us on sumi@dreamjobb.com to upgrade or change', 'info');
      } else {
        this.openDialog(plan, planType);
      }
        // /** Creating Session Object */
        // /** See @see https://stripe.com/docs/api/checkout/sessions/retrieve for the reference of the fields */
        // const session = {
        //   payment_method_types: ['card'],
        //   subscription_data: {
        //     items: [{ plan: plan.id, quantity: 1 }],
        //     trial_period_days: 30
        //   },
        //   mode: 'subscription',
        //   success_url: this.DOMAIN + "?session_id={CHECKOUT_SESSION_ID}",
        //   cancel_url: this.DOMAIN,
        //   customer_email: this.authService.loggedInUser.email,
        //   client_reference_id: this.authService.loggedInUser._id
        // };

        // /** Making API call in Backend to Create Session */
        // this.http.post(environment.serverless_url + 'createCheckoutSession', session).toPromise().then((d: any) => {
        //   console.log(d);

        //   /** Once we get the session ID, User will get redirected to the payment page */
        //   this.stripe.redirectToCheckout({
        //     /** Make the id field from the Checkout Session creation API response */
        //     sessionId: d.session.id
        //   }).then((result) => {
        //     console.log(result);
        //     /** If `redirectToCheckout` fails due to a browser or network */
        //     /** error, display the localized error message to your customer */
        //     /** using `result.error.message`. */
        //   });
        // });
    } else {
      await this.authService.checkIfUserIsLoggedIn(true);
    }
  }

  addTrnsaction() {
    const transaction = JSON.parse(localStorage.getItem('subscription'));

    if (transaction) {
      transaction.sessionId = this.sessionId;
      this.sellingService.addTransaction(transaction).pipe(
        tap((d) => {
          if (d) {
            localStorage.removeItem('subscription');
            console.log(d);
            this.successfulPurchasedSubscription = d.subscription;
            this.successfulPayment.type = 'success';
            // this.store.dispatch(GetCartProductsList());
            this.successfulPayment.show();
          }
        })
      ).subscribe();
    }
  }

  openDialog(plan, planType): void {
    const dialogRef = this.dialog.open(SubscriptionDialogComponent, {
      width: '430px',
      height: '550px',
      maxHeight: '700px',
      panelClass: 'no-padding',
      data: {plan, planType},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
