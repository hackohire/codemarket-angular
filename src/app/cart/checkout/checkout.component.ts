import { Component, OnInit, ElementRef, ViewChild, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { Subscription, forkJoin } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/shared/models/product.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { tap, map, mergeMap, first } from 'rxjs/operators';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SellingProductsService } from 'src/app/selling/selling-products.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { PostService } from 'src/app/shared/services/post.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
declare var Stripe;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  breadcumb: BreadCumb;
  cartProductsList: Product[];
  // @ViewChild('paypal', { static: false }) paypalElement: ElementRef;
  @ViewChild('successfulPayment') successfulPayment: SwalComponent;
  successfulPurchasedProducts = [];
  subscription$: Subscription;
  cartTotal: number;
  sessionId: string;

  products: any[];
  items: any[];

  stripe;
  // Replace with your own public key: https://dashboard.stripe.com/test/apikeys
  PUBLIC_KEY = environment.stripe_public_key;
  // Replace with the domain you want your users to be redirected back to after payment
  DOMAIN = window.location.href;

  constructor(
    private store: Store<AppState>,
    public productService: ProductService,
    public postService: PostService,
    public sellingService: SellingProductsService,
    public authService: AuthService,
    public http: HttpClient,
    private activatedRoute: ActivatedRoute,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {

    const a = forkJoin({
      cartTotal: this.productService.cartTotal,
      cartList: this.productService.cartProductList
    });

    a.subscribe({
      next: (c: any) => console.log(c),
      error: (d) => console.log(d)
    });

    this.breadcumb = {
      title: 'Please Make the Payment to Purchase These Amazing Products',
      path: [

        {
          name: 'Cart'
        },
        {
          name: 'Checkout'
        }
      ]
    };
  }

  ngOnInit() {

    this.stripe = Stripe(this.PUBLIC_KEY);

    this.subscription$ = this.productService.cartTotal.pipe(
      mergeMap(source => this.productService.cartProductList.pipe(
        map(inner => [source, inner])
      )
      )
    ).subscribe(([cartTotal, pList]) => {
      // console.log(e , r);
      this.cartTotal = cartTotal as number;

      this.cartProductsList = [...pList as any[]];

      if (cartTotal != null && (pList as any[]).length) {
        /** Items inside purchase units of paypal */
        this.items = (pList as any[]).map((prod) => {
          const p: any = {};
          p.name = prod.name;
          p.amount = prod.price * 100;
          p.currency = 'usd';
          p.quantity = 1;
          // p.description = prod.description;
          // p.id = prod._id
          // p.reference_id = prod._id;
          // p.purchasedBy = this.authService.loggedInUser._id
          return p;
        });


      }
    });

    /** Check for the session_id, if the session_id is there, fetch the session and show success sweetalert for product purchase */
    this.activatedRoute.queryParams.pipe(first()).toPromise().then((params) => {
      if (params.session_id) {
        this.sessionId = params.session_id;
        this.addTransaction();
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

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }

  setTransactionObjectInLocalStorage(transaction: any = {}) {
    transaction.sessionId = this.sessionId;
    transaction.purchasedBy = this.authService.loggedInUser._id;
    transaction.purchase_units = this.cartProductsList.map((u, i) => {
      const a: any = {};
      a.name = u.name;
      a.purchasedBy = this.authService.loggedInUser._id;
      a.sessionId = this.sessionId;
      a.reference_id = u._id;
      a.amount = u.price;
      return a;
    });

    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem('transaction', JSON.stringify(transaction));
    }
  }

  addTransaction() {
    if (isPlatformBrowser(this._platformId)) {
      const transaction = JSON.parse(localStorage.getItem('transaction'));

      if (transaction) {
        transaction.sessionId = this.sessionId;
        transaction.purchase_units.forEach((u) => u.sessionId = this.sessionId);
        this.sellingService.addTransaction(transaction).pipe(
          tap((d) => {
            if (d) {
              localStorage.removeItem('transaction');
              console.log(d);
              this.successfulPurchasedProducts = transaction.purchase_units;
              this.successfulPayment.type = 'success';
              // this.store.dispatch(GetCartProductsList());
              this.successfulPayment.show();
            }
          })
        ).subscribe();
      }
    }
  }

  redirectToCheckout() {
    let idSring = '';
    this.cartProductsList.forEach((p, i) => idSring = idSring + p._id + (i < this.cartProductsList.length - 1) ? ',' : '');
    const session = {
      payment_method_types: ['card'],
      line_items: this.items,
      success_url: this.DOMAIN + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: this.DOMAIN,
      client_reference_id: this.authService.loggedInUser._id,
      customer_email: this.authService.loggedInUser.email,
      payment_intent_data: { metadata: { purchasedItems: idSring } },
    };
    this.http.post(environment.serverless_url + 'createCheckoutSession', session).toPromise().then((d: any) => {
      console.log(d);
      if (d) {
        this.setTransactionObjectInLocalStorage();
      }
      this.stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: d.session.id
      }).then(function (result) {
        console.log(result);
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      });
    });
  }

}
