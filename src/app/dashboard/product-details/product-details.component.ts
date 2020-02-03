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
import { AuthService } from 'src/app/core/services/auth.service'
import moment from 'moment';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { ShareService } from '@ngx-share/core';
import { UserService } from 'src/app/user/user.service';
import { MatDialog } from '@angular/material';
import { VideoChatComponent } from 'src/app/video-chat/video-chat.component';
import Peer from 'peerjs';
import { PostService } from '../../shared/services/post.service';
import { SetSelectedPost } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { Post } from '../../shared/models/post.model';
import { EditorComponent } from '../../shared/components/editor/editor.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [ShareService, CommentService]
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  // modules for quill view component
  modules = {
    formula: true,
    // imageResize: {},
    syntax: true,
  };

  likeCount: number;
  productDetails: Product;
  purchasedByLoggedInUser: boolean;

  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  commentsList: any[];

  breadcumb: BreadCumb;

  commentForm: FormGroup;

  productDetails$: Observable<Post>;
  subscription$: Subscription = new Subscription();

  peer: Peer;

  commentId: string;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public productService: ProductService,
    public postService: PostService,
    public authService: AuthService,
    public commentService: CommentService,
    public share: ShareService,
    private userService: UserService,
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
    this.subscription$.add(this.userService.peer.subscribe((p) => {
      if (p) {
        console.log(p);
        this.peer = p;
      }
    }));
  }

  ngOnDestroy() {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
      // this.store.dispatch(SetSelectedPost({ post: null }));
    }
    
    /** Unsubscribes from Comments Related Subscription */
    this.commentService.unsubscribe();
  }

  ngOnInit() {

    const params = this.activatedRoute.snapshot.params;
    this.commentId = this.activatedRoute.snapshot.queryParams['commentId'];
    const postId = params.slug.split('-').pop();

    // this.productDetails$ = this.store.select(selectSelectedPost);

    this.subscription$.add(this.store.select(selectSelectedPost).pipe(
      tap((p: Product) => {
        if (p) {
          this.productDetails = p;

          this.productDetails$ = of(p);

          this.subscription$.add(
            this.authService.loggedInUser$.subscribe(u => {
              if (u && p && p.purchasedBy && p.purchasedBy.length) {
                this.purchasedByLoggedInUser = p.purchasedBy.filter(p => p._id === u._id).length ? true : false;
              }
            })
          );

          this.commentForm = new FormGroup({
            text: new FormControl(''),
            referenceId: new FormControl(p._id),
            type: new FormControl('product'),
          });


          this.commentService.getCommentsByReferenceId(p, this.commentId);

        } else if (this.productDetails && this.productDetails._id === postId) {
          /** Comes inside this block, only when we are already in a post details page, and by using searh,
           * we try to open any other post detials page
           */
        } else {
          // this.store.dispatch(GetPostById({ postId }));
        }
      }),
    ).subscribe());
  }

  getDate(d: string) {
    return new Date(+d);
  }

  async addToCart(product: Product) {
    if (await !this.authService.loggedInUser) {
      await this.authService.checkIfUserIsLoggedIn(true);
    } else {
      this.store.dispatch(AddToCart({ productId: product._id }));
    }
  }

  async addComment(addCommentEditor: EditorComponent) {
    if (this.authService.loggedInUser) {
      const blocks =  await addCommentEditor.editor.save();
      this.commentForm.get('text').setValue(blocks.blocks);
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentService.addComment(this.commentForm.value).subscribe(c => {
        if (c) {
          addCommentEditor.editor.blocks.clear();
        }
      });
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
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
    this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: { authorId, peer: this.peer },
      disableClose: true
    });
  }

}
