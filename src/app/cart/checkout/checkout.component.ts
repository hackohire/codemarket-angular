import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked, AfterViewInit, AfterContentChecked, AfterContentInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/shared/models/product.model';
import * as _ from 'lodash';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { selectCartProductList } from 'src/app/core/store/selectors/cart.selectors';
import { withLatestFrom, map, subscribeOn } from 'rxjs/operators';
import { selectAllProductsList } from 'src/app/core/store/selectors/product.selectors';
declare var paypal;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit {

  breadcumb: BreadCumb;
  cartProductsList: Observable<Product[]>;
  @ViewChild('paypal', { static: false }) paypalElement: ElementRef;

  products: any;

  paidFor = false;

  constructor(
    private store: Store<AppState>,
    public productService: ProductService
  ) {
    this.cartProductsList = this.productService.getProductsInCart();


    this.productService.getProductsInCart().subscribe((pList: Product[]) => {
      this.products = pList.map((prod) => {
        const p: any = {};
        p.description = prod.name;
        p.amount = {
          currency_code: 'INR',
          value: prod.totalPrice
        };

        return p;
      });
    });

    this.breadcumb = {
      title: 'Please Make the Payment to Purchase These Amazing Products',
      path: [
        {
          name: 'Dashboard'
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

  ngAfterViewInit() {
    if (this.paypalElement && this.paypalElement.nativeElement &&this.products.length) {
      paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: this.products
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          this.paidFor = true;
          console.log(order);
        },
        onError: err => {
          console.log(err);
        }
      }).render(this.paypalElement.nativeElement);
    }
  }

  ngOnInit() {
  }

  redirectToProductDetails(product: Product): void {
    this.productService.redirectToProductDetails(product);
  }

}
