import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/product.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { SetSelectedProduct } from 'src/app/core/store/actions/product.actions';
import { AddToCart } from 'src/app/core/store/actions/cart.actions';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product: Product;
  constructor(
    private store: Store<AppState>,
    public productService: ProductService
  ) {
    console.log(this.product);
  }

  ngOnInit() {
  }

  redirectToProductDetails(product: Product): void {
    this.productService.redirectToProductDetails(product);
  }

  addToCart(product: Product) {
    this.store.dispatch(AddToCart({productId: product._id}));
  }

}
