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
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { map, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { CommentService } from 'src/app/shared/services/comment.service';
import { Comment } from 'src/app/shared/models/comment.model';

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

  commentsList: any[];

  breadcumb: BreadCumb;

  commentForm: FormGroup;

  productDetails$: Observable<Product>;
  subscription$: Subscription;
  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public productService: ProductService,
    private authService: AuthService,
    private commentService: CommentService
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
          this.commentForm = new FormGroup({
            text: new FormControl(''),
            referenceId: new FormControl(p._id),
            type: new FormControl('product'),
          });

          this.commentService.getCommentsByReferenceId(p._id).pipe(
            tap((d) => {
              this.commentsList = d;
            })
          ).subscribe();
        } else {
          const params = this.activatedRoute.snapshot.params;
          if (params['productId']) {
            this.store.dispatch(GetProductById({ productId: params.productId }));
          }
        }

      }),
    ).subscribe();
  }

  getDate(d: string) {
    return new Date(+d);
  }

  addToCart(product: Product) {
    this.store.dispatch(AddToCart({ productId: product._id }));
  }

  addComment() {
    console.log(this.commentForm.value);
    if (this.authService.loggedInUser) {
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentService.addComment(this.commentForm.value).pipe(
        switchMap((d) => {
          return this.commentService.getCommentsByReferenceId(d.referenceId);
        }),
        tap((d) => {
          console.log(d);
          if (d && d.length) {
            this.commentsList = d;
            this.commentForm.reset();
          }
        })
      ).subscribe();
    }
  }

  updateFormData(event) {
    this.commentForm.get('text').setValue(event);
  }

  fromNow(date) {
    const d = new Date(+date);
    return moment(d).fromNow();
  }

}
