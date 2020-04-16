import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MembershipService } from '../membership.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { SetLoggedInUser } from '../../core/store/actions/user.actions';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Router } from '@angular/router';
import { appConstants } from '../../shared/constants/app_constants';
import { isPlatformBrowser } from '@angular/common';
declare var Stripe;
const PUBLIC_KEY = environment.stripe_public_key;
const stripe = Stripe(PUBLIC_KEY);
const elements = stripe.elements();
const card = elements.create('card', {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
});

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-dialog.component.html',
  styleUrls: ['./subscription-dialog.component.scss'],
})
export class SubscriptionDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('cardForm') cardForm: ElementRef;
  @ViewChild('successfulPayment') successfulPayment: SwalComponent;
  promoCodeControl = new FormControl('');
  trial_period_days: number;

  promoCodes = appConstants.promoCodes;
  appliedPromoCode: string;

  userSelection = true;
  usersListForm: FormGroup;
  get userList() {
    return this.usersListForm.get('list') as FormArray;
  }
  // Replace with your own public key: https://dashboard.stripe.com/test/apikeys
  PUBLIC_KEY = environment.stripe_public_key;
  // Replace with the domain you want your users to be redirected back to after payment
  DOMAIN = '';
  quantity = 1;
  stripeId: string;

  activatedCoupon: any;

  constructor(
    public dialogRef: MatDialogRef<SubscriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private membershipService: MembershipService,
    private store: Store<AppState>,
    private router: Router,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    if(isPlatformBrowser(this._platformId)) {
      this.DOMAIN = window.location.href;
    }
  }


  ngAfterViewInit() {
    card.mount(this.cardForm.nativeElement);
  }

  async ngOnInit() {


    this.usersListForm = this.fb.group({
      list: this.fb.array([])
    });
    this.addUser();

    this.userList.valueChanges.subscribe((v) => {
      if (v.length) {
        this.quantity = v.length;
      }
    });

    if (!this.authService.loggedInUser.stripeId) {
      const updatedUser = await this.membershipService.createStripeUser();
      this.stripeId = updatedUser.user.stripeId;
      this.authService.loggedInUser.stripeId = this.stripeId;
      this.store.dispatch(SetLoggedInUser({ payload: this.authService.loggedInUser }));
    } else {
      this.stripeId = this.authService.loggedInUser.stripeId;
    }
  }

  async handleForm() {
    // e.preventDefault();

    try {
      const { token, error } = await stripe.createToken(card);
      const metadata = {
        userId: this.authService.loggedInUser._id,
        email: this.authService.loggedInUser.email
      };
      const successfulSubscription = await this.membershipService.attachCardAndCreateSubscription(
        token.id,
        this.stripeId,
        this.trial_period_days,
        metadata,
        [{ plan: this.data.plan.id, quantity: this.quantity }],
        this.promoCodeControl.value
      );

      if (successfulSubscription) {
        this.successfulPayment.show();
      }
    } catch (e) { console.log(e); }
  }

  onConfirm(e) {
    this.router.navigate(['/', { outlets: { main: ['membership', `${this.data.plan.id}`, 'success']}}], {queryParams: {planType: this.data.planType}});
    this.dialogRef.close();
  }

  addUser() {
    this.userList.push(
      this.fb.group(
        {
          name: this.fb.control('', Validators.required),
          email: this.fb.control('', Validators.required)
        }
      )
    );
  }

  removeUser(i: number) {
    this.userList.removeAt(i);
  }

  userSelectionChange(e) {
    console.log(e);
    if (e.value) {
      this.quantity = 1;
    }
  }

  async applyPromo() {
    if (this.promoCodeControl.value === this.promoCodes.FIRSTMONTHFREE.title) {
      this.appliedPromoCode = this.promoCodeControl.value;
      this.promoCodes.FIRSTMONTHFREE.applied = true;
      this.trial_period_days = 30;
    } else {
      const coupon = await this.membershipService.getCouponByName(this.promoCodeControl.value);
      console.log(coupon);
      if (coupon) {
        this.activatedCoupon = coupon.coupon;
        this.appliedPromoCode = this.promoCodeControl.value;
        // this.promoCodes[coupon.coupon.id].applied = true;
        this.trial_period_days = 0;
      }
    }
  }

  removePromoCode() {
    this.promoCodeControl.setValue('');
    this.appliedPromoCode = '';
    if (this.promoCodeControl.value === this.promoCodes.FIRSTMONTHFREE.title) {
      this.trial_period_days = 0;
    } else {
      this.activatedCoupon = null;
    }
  }

  setSubscriptionObjectInLocalStorage(transaction: any = {}) {
    transaction.sessionId = '';
    transaction.purchasedBy = this.authService.loggedInUser._id;
    transaction.subscription = {
      subscriptionUsers: this.userSelection ? [] : this.userList.value,
      reference_id: this.data.plan.id,
      amount: this.data.plan.fixed_price.value,
      name: this.data.plan.name,
      purchasedBy: this.authService.loggedInUser._id
    };
    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem('subscription', JSON.stringify(transaction));
    }
  }

  async redirectToCheckout() {
    /** Creating Session Object */
    /** See @see https://stripe.com/docs/api/checkout/sessions/retrieve for the reference of the fields */
    const session = {
      payment_method_types: ['card'],
      subscription_data: {
        items: [{ plan: this.data.plan.id, quantity: this.quantity }],
        // trial_period_days: 30,
        // coupon: 'Test Coupon'
      },
      mode: 'subscription',
      success_url: this.DOMAIN + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: this.DOMAIN,
      customer_email: this.authService.loggedInUser.email,
      client_reference_id: this.authService.loggedInUser._id
    };

    /** Making API call in Backend to Create Session */
    this.http.post(environment.serverless_url + 'createCheckoutSession', session).toPromise().then((d: any) => {
      console.log(d);

      if (d) {
        this.setSubscriptionObjectInLocalStorage();
      }
      /** Once we get the session ID, User will get redirected to the payment page */
      stripe.redirectToCheckout({
        /** Make the id field from the Checkout Session creation API response */
        sessionId: d.session.id
      }).then((result) => {
        console.log(result);
        /** If `redirectToCheckout` fails due to a browser or network */
        /** error, display the localized error message to your customer */
        /** using `result.error.message`. */
      });
    });
  }

}
