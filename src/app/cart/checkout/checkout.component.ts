import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { Observable, Subscription } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/shared/models/product.model';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { tap, map, delay } from 'rxjs/operators';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SellingProductsService } from 'src/app/selling/selling-products.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { GetCartProductsList } from 'src/app/core/store/actions/cart.actions';
declare var paypal;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  breadcumb: BreadCumb;
  cartProductsList: Product[];
  @ViewChild('paypal', { static: false }) paypalElement: ElementRef;
  @ViewChild('successfulPayment', { static: false }) successfulPayment: SwalComponent;
  successfulPurchasedProducts = [];
  subscription: Subscription;

  products: any[];
  items: any[];

  constructor(
    private store: Store<AppState>,
    public productService: ProductService,
    public sellingService: SellingProductsService,
    public authService: AuthService
  ) {
    // this.cartProductsList = this.productService.cartProductList;

    this.subscription = this.productService.cartProductList.pipe(
      tap((pList: Product[]) => {
        this.cartProductsList = [...pList];


        this.items = pList.map((prod) => {
          const p: any = {};
          p.name = prod.name;
          p.reference_id = prod._id;
          p.unit_amount = {
            currency_code: 'INR',
            value: prod.price
          };
          p.quantity = 1;
          return p;
        });

        let c = 0;
        this.items.forEach((p) => c += p.unit_amount.value);

        this.products = [{
          description: 'ABC',
          reference_id: 'DEF',
          amount: {
            currency_code: 'INR',
            value: c.toFixed(2),
            breakdown: {
              currency_code: 'INR',
              value: c.toFixed(2),
              item_total: {
                value: c.toFixed(2),
                currency_code: 'INR'
              },
            },

          },
          value: c.toFixed(2).toString(),
          items: this.items
        }];

        this.createPaypalButton();
      })
    ).subscribe();


    this.breadcumb = {
      title: 'Please Make the Payment to Purchase These Amazing Products',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  redirectToProductDetails(product: Product): void {
    this.productService.redirectToProductDetails(product);
  }

  addTransaction(transaction) {
    const loggedInUserId = this.authService.loggedInUser ? this.authService.loggedInUser._id : '';
    transaction.purchase_id = transaction.id;
    transaction.purchasedBy = loggedInUserId;

    transaction.purchase_units = this.items.map((u, i) => {
      const a: any = {};
      a.description = u.description;
      a.amount = {
        currency_code : u.unit_amount.currency_code,
        value: u.unit_amount.value.toString()
      };
      a.purchasedBy = loggedInUserId;
      a.description = u.name;
      a.payee = transaction.purchase_units[0].payee;
      a.reference_id = u.reference_id;
      a.payments = transaction.purchase_units[0].payments;
      a.shipping = transaction.purchase_units[0].shipping;
      a.soft_descriptor = transaction.purchase_units[0].soft_descriptor;
      return a;
    });

    this.sellingService.addTransaction(transaction).pipe(
      tap((d) => {
        if (d && d.length) {
          console.log(d);
          this.successfulPurchasedProducts = transaction.purchase_units;
          this.successfulPayment.type = 'success';
          this.store.dispatch(GetCartProductsList());
          this.successfulPayment.show();
        }
      })
    ).subscribe();
  }

  createPaypalButton() {
    setTimeout(() => {
      if (this.paypalElement && this.paypalElement.nativeElement && this.products.length) {
        paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: this.products
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log(data);
            console.log(order);
            this.addTransaction(order);
          },
          onError: err => {
            console.log(err);
          }
        }).render(this.paypalElement.nativeElement);
      }
    }, 0);
  }

}
