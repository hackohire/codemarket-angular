import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from 'src/app/shared/models/product.model';
import { Subscription, merge, of, Observable } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { map, startWith, catchError, switchMap, switchMapTo, mapTo } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';
import moment from 'moment';
import { environment } from 'src/environments/environment';
import { PostService } from 'src/app/shared/services/post.service';
import { selectLoggedInUser } from '../../core/store/selectors/user.selector';
import { GetPostsByUserIdAndType, DeletePost, SetSelectedPost } from '../../core/store/actions/post.actions';
import { PostType } from '../../shared/models/post-types.enum';
import { selectPostsByUserIdAndType } from '../../core/store/selectors/post.selectors';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { appConstants } from '../../shared/constants/app_constants';
import { Post } from '../../shared/models/post.model';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('bodyExpansion', [
      state('collapsed', style({ height: '0px', display: 'none' })),
      state('expanded', style({ height: '*', display: 'block' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
  ],
})
export class ProductsListComponent implements OnInit, OnDestroy, AfterViewInit {

  length: number;
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  postTypesArray = appConstants.postTypesArray;

  all: boolean;

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  expandedProduct: Product | null;

  purchasedBy;

  userSubsription: Subscription;
  productsListSubscription: Subscription;

  breadcumb: BreadCumb;

  authorId: string; // Id of the user whose profile is being visited by loggedInUser

  postTypes = Object.values(PostType);

  paginator: MatPaginator;
  selectedPostType = '';

  selectedBlock = null;

  selectedPost: Post;
  selectedPostComments: Observable<Comment[]>;

  /** Side bar to filter the categories */
  filtersMainCategory = [
    {
      view: '',
      title: 'All',
      path: ''
    },
  ];

  constructor(
    public authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public postService: PostService,
    public sweetAlertService: SweetalertService,
    private router: Router
  ) {
  }

  ngOnInit() {
    const path = this.activatedRoute.parent.routeConfig.path;
    this.selectedPostType = this.activatedRoute.snapshot.queryParams['view'] ? this.activatedRoute.snapshot.queryParams['view'] : '';

    // Checking if authorId is there to see if user is trying to visit somebody else's profile or his own profile(loggedin User's own Profile)
    this.authorId = this.activatedRoute.parent.snapshot.parent.params.authorId;


    if (path === 'bugfixes-all') {
      /** Set the columns visible in the table */
      this.displayedColumns = ['number', 'name', 'price', 'createdBy', 'type', 'category', 'createdAt', 'action'];
      this.all = true;
    } else {

      let status = '';

      // If authorId is there, User is visiting somebody else's profile so we don't show action buttons
      if (this.authorId) {
        this.displayedColumns = ['number', 'name', 'price'];
        status = PostStatus.Published;
        this.store.dispatch(GetPostsByUserIdAndType(
          {
            userId: this.authorId,
            status,
            postType: PostType.Product
          }));
      } else {
        this.displayedColumns = ['number', 'name', 'price', 'status', 'action'];
        this.store.select(selectLoggedInUser).subscribe((u) => {
          if (u) {
            this.store.dispatch(GetPostsByUserIdAndType(
              {
                userId: this.authService.loggedInUser._id,
                status,
                postType: PostType.Product
              }));
          }
        });
      }

      this.productsListSubscription = this.store.select(selectPostsByUserIdAndType).pipe(
        map((products) => {
          if (products) {
            this.dataSource.data = products;
          }
        })
      ).subscribe();
    }
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    if (this.productsListSubscription) {
      this.productsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.userSubsription.unsubscribe();
    }
  }

  deleteProduct(postId: string) {
    this.sweetAlertService.confirmDelete((e) => {
      this.store.dispatch(DeletePost({ postId }));
    });
  }

  getListOfUsersWhoPurchased(product: Product) {
    /** If the row is not expanded we expand it otherwise collapse it */
    this.expandedProduct = this.expandedProduct === product ? null : product;

    /** If the row is in expanded mode */
    if (this.expandedProduct === product) {
      /** we call product service to make the query to backend to fetch the list of user who purchased */
      this.productService.getListOfUsersWhoPurchased(product._id).subscribe((d) => {
        console.log(d);
        this.purchasedBy = d;
      });
    } else {
      /** Otherwise we set it null */
      this.purchasedBy = null;
    }
  }

  fromNow(date) {
    const d = new Date(+date);
    return moment(d).fromNow();
  }

  getAllPosts(type) {
    console.log(type);
    if (type) {
      this.paginator.pageIndex = 0;
    }
    const paginationObj = {
      pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      sort: {order: ''}};
    this.postService.getAllPosts(paginationObj, this.selectedPostType ? this.selectedPostType : type ).pipe(
      map((result: any) => {
        if (result && result.posts) {
          /** Set the data for the datatable  */
          this.length = result.total;
          this.dataSource.data = result.posts;
        }
      })
    ).subscribe();
  }

  /** Select the category */
  selectMainCategory(category, panel) {
    if (!category.types) {
      this.selectedPostType = '';
      this.router.navigate([category && category.path ? category.path : './'],
        {
          relativeTo: this.activatedRoute,
          queryParams: { view: category.view }, queryParamsHandling: 'merge'
        });
      this.getAllPosts('');
    } else {
      panel.toggle();
    }
  }

  showCommentsOnSide(event: { block: any, comments, selectedPost}) {
    console.log(event);
    this.selectedBlock = event.block;
    this.selectedPostComments = event.comments;
    this.selectedPost = event.selectedPost;
  }

  redirectToAddPost(postType) {
    this.router.navigate(['../post/add-post'], { queryParams: { type: postType } });
  }

  /** If "view" query param is sub post type then expand the main category */
  isExpanded(category) {
    if (category && category.types) {
      const i = category.types.indexOf(this.selectedPostType) > -1;
      return i;
    }
    return false;
  }

}
