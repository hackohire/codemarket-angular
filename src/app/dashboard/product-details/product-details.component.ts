import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { Product } from 'src/app/shared/models/product.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { AddToCart } from 'src/app/core/store/actions/cart.actions';
import { ProductService } from 'src/app/core/services/product.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { switchMap } from 'rxjs/operators';
import moment from 'moment';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { ShareService } from '@ngx-share/core';
import { Meta, Title } from '@angular/platform-browser';
import { UserService } from 'src/app/user/user.service';
import { MatDialog } from '@angular/material';
import { VideoChatComponent } from 'src/app/video-chat/video-chat.component';
import Peer from 'peerjs';
import { PostService } from '../../shared/services/post.service';
import { GetPostById, SetSelectedPost } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [ShareService]
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  // modules for quill view component
  modules = {
    formula: true,
    // imageResize: {},
    syntax: true,
  };

  likeCount: number;

  anonymousAvatar = require('src/assets/images/anonymous-avatar.jpg');
  codemarketBucketURL = environment.codemarketFilesBucket;

  commentsList: any[];

  breadcumb: BreadCumb;

  commentForm: FormGroup;

  productDetails$: Observable<Product>;
  subscription$: Subscription;

  peer: Peer;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public productService: ProductService,
    public postService: PostService,
    public authService: AuthService,
    private commentService: CommentService,
    public share: ShareService,
    private userService: UserService,
    private meta: Meta,
    private title: Title,
    private dialog: MatDialog
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

    /** Peer Subscription for Video Call */
    this.userService.peer.subscribe((p) => {
      if (p) {
        console.log(p);
        this.peer = p;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
      this.store.dispatch(SetSelectedPost({ post: null }));
    }

    this.title.setTitle('Codemarket');
  }

  ngOnInit() {

    const params = this.activatedRoute.snapshot.queryParams;
    this.productDetails$ = this.store.select(selectSelectedPost);

    this.subscription$ = this.store.select(selectSelectedPost).pipe(
      tap((p: Product) => {
        if (p) {

          /** adding meta tags */
          this.meta.addTag({ property: 'og:title', content: p.name });
          this.meta.addTag({ property: 'twitter:title', content: p.name });
          this.meta.addTag({ property: 'og:url', content: window.location.href });
          this.meta.addTag({ property: 'al:web:url', content: window.location.href });
          this.meta.addTag({ property: 'og:type', content: 'article' });

          this.meta.addTag({ name: 'title', content: p.name });
          this.meta.addTag({ name: 'og:url', content: window.location.href });
          this.meta.addTag({ name: 'al:web:url', content: window.location.href });
          this.meta.addTag({ name: 'og:type', content: 'article' });

          /** Setting the page title */
          this.title.setTitle(p.name);

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
          this.store.dispatch(GetPostById({ postId: params.postId }));
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
            // this.commentForm.patchValue({text: null}, {emitEvent: true});
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

  openDialog(authorId?: string): void {
    const dialogRef = this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: { authorId, peer: this.peer },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
