import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/models/product.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { AddToCart } from 'src/app/core/store/actions/cart.actions';
import { ProductService } from 'src/app/core/services/product.service';
import { environment } from 'src/environments/environment';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() product: Product;
  anonymousAvatar = require('src/assets/images/anonymous-avatar.jpg');
  codemarketBucketURL = environment.codemarketFilesBucket;
  constructor(
    private store: Store<AppState>,
    public productService: ProductService,
    public postService: PostService
  ) {
    console.log(this.product);
  }

  ngOnInit() {
  }

  addToCart(product: Product) {
    this.store.dispatch(AddToCart({productId: product._id}));
  }

}
