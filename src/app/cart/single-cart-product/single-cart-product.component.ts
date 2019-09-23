import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/shared/models/product.model';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-single-cart-product',
  templateUrl: './single-cart-product.component.html',
  styleUrls: ['./single-cart-product.component.scss']
})
export class SingleCartProductComponent implements OnInit {

  @Output() removeProduct: EventEmitter<string> = new EventEmitter();
  @Input() product: Product;

  constructor(
    public postService: PostService
  ) {
  }

  ngOnInit() {
  }

  removeProductFromCart(productId: string): void {
    this.removeProduct.emit(productId);
  }
}
