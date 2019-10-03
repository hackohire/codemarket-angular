import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MembershipService } from './membership.service';
import { BreadCumb } from '../shared/models/bredcumb.model';
import { plans } from '../shared/constants/plan_details';
import { AuthService } from '../core/services/auth.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';
import { HttpClient } from '@angular/common/http';
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
  PUBLIC_KEY = environment.stripe_public_key;;
  // Replace with the domain you want your users to be redirected back to after payment
  DOMAIN = window.location.href;

  breadcumb: BreadCumb;
  listOfPlans = plans;
  stripe;

  constructor(
    public memborshipService: MembershipService,
    public authService: AuthService,
    public activatedRoute: ActivatedRoute,
    private http: HttpClient
  ) {
    this.breadcumb = {
      title: 'Subscription based On-demand leadership training for sofwtare engineers and software teams',
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
    
    this.activatedRoute.queryParams.pipe(first()).toPromise().then((params) => {
      if (params.session_id) {
        this.http.post(environment.serverless_url + 'checkoutSessionCompleted', {session_id: params.session_id}).toPromise().then((d) => {
          console.log(d);  
        })
      }
    });
  }

  async redirectToCheckout(planId: string) {
    if (this.authService.loggedInUser) {
        /** Creating Session Object */
        /** See @see https://stripe.com/docs/api/checkout/sessions/retrieve for the reference of the fields */
        const session = {
          payment_method_types: ['card'],
          subscription_data: {
            items: [{ plan: planId, quantity: 1 }],
            trial_period_days: 30
          },
          success_url: this.DOMAIN + "?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: this.DOMAIN,
          customer_email: this.authService.loggedInUser.email,
          client_reference_id: this.authService.loggedInUser._id
        };
        
        /** Making API call in Backend to Create Session */
        this.http.post(environment.serverless_url + 'createCheckoutSession', session).toPromise().then((d: any) => {
          console.log(d);

          /** Once we get the session ID, User will get redirected to the payment page */
          this.stripe.redirectToCheckout({
            /** Make the id field from the Checkout Session creation API response */
            sessionId: d.session.id
          }).then((result) => {
            console.log(result);
            /** If `redirectToCheckout` fails due to a browser or network */
            /** error, display the localized error message to your customer */
            /** using `result.error.message`. */
          });
        })
    } else {
      await this.authService.checkIfUserIsLoggedIn(true);
    }
  }

  handleResult = (result: any): void => {
    if (result.error) {
      var displayError = document.getElementById("error-message");
      displayError.textContent = result.error.message;
    }
  };

}
