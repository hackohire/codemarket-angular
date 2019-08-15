import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { Product } from 'src/app/shared/models/product.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { selectSelectedProduct } from 'src/app/core/store/selectors/product.selectors';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { GetProductById } from 'src/app/core/store/actions/product.actions';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { AddToCart } from 'src/app/core/store/actions/cart.actions';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  // modules for quill view component
  modules = {
    formula: true,
    // imageResize: {},
    syntax: true,
  };

  breadcumb: BreadCumb;


  productDetails$: Observable<Product>;
  subscription$: Subscription;
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public productService: ProductService
  ) {
    this.breadcumb = {
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Product Details'
        }
      ]
    };
  }

  ngOnInit() {
    this.productDetails$ = this.store.select(selectSelectedProduct);

    this.subscription$ = this.store.select(selectSelectedProduct).pipe(
      tap((p: Product) => {
        if (p) {
          this.productDetails$ = of(p);
        } else {
          const params = this.activatedRoute.snapshot.params;
          if (params['productId']) {
          this.store.dispatch(GetProductById({productId: params.productId}));
          }
        }

      })
    ).subscribe();
  }

  getDate(d: string) {
    return new Date(+d);
  }

  addToCart(product: Product) {
    this.store.dispatch(AddToCart({productId: product._id}));
  }

}
