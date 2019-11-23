import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Product } from 'src/app/shared/models/product.model';
import { Subscription, merge, of } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { map, startWith, catchError, switchMap, switchMapTo, mapTo } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
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
  ],
})
export class ProductsListComponent implements OnInit, OnDestroy, AfterViewInit {

  length: number;
  anonymousAvatar = require('src/assets/images/anonymous-avatar.jpg');
  codemarketBucketURL = environment.codemarketFilesBucket;

  all: boolean;

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  expandedProduct: Product | null;

  purchasedBy;

  userSubsription: Subscription;
  productsListSubscription: Subscription;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  breadcumb: BreadCumb;

  authorId: string; // Id of the user whose profile is being visited by loggedInUser

  postTypes = Object.values(PostType);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  selectedPostType = '';

  constructor(
    public auth: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public postService: PostService,
    public sweetAlertService: SweetalertService
  ) {


    this.breadcumb = {
      title: 'Code Q&A',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'bugfixes'
        }
      ]
    };
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;

    const path = this.activatedRoute.parent.routeConfig.path;

    // Checking if authorId is there to see if user is trying to visit somebody else's profile or his own profile(loggedin User's own Profile)
    this.authorId = this.activatedRoute.parent.snapshot.parent.params.authorId;


    if (path === 'bugfixes-all') {
      /** Set the columns visible in the table */
      this.displayedColumns = ['number', 'name', 'price', 'createdBy', 'type', 'category', 'createdAt', 'action'];
      this.all = true;

      // this.getAllPosts('');
      // this.productsListSubscription = this.postService.getAllPosts({ pageNumber: 1, limit: 10 }).pipe(
      //   map((posts) => {
      //     if (posts) {
      //       /** Set the data for the datatable  */
      //       this.dataSource.data = posts;


      //     }
      //   })
      // ).subscribe();

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
                userId: this.auth.loggedInUser._id,
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
    merge(this.paginator.page)
    .pipe(
      startWith({}),
      catchError((e) => {
        return of(e);
      })
    )
    .subscribe(data => {
      // const paginationObj = {
      //   pageNumber: this.paginator.pageIndex + 1,
      //   limit: 5,
      //   sort: {
      //     field: this.sort && this.sort.active ? this.sort.active : 'createdAt',
      //     order: this.sort && this.sort.direction ? this.sort.direction : ''
      //   }
      // }
      this.getAllPosts('');
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    if (this.productsListSubscription) {
      this.productsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.userSubsription.unsubscribe();
    }
  }

  editProduct(post): void {
    this.store.dispatch(SetSelectedPost({ post }));
    // this.router.navigate(['/add-product'], );
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
    const paginationObj = {pageNumber: this.paginator.pageIndex + 1, limit: 10, sort: {order: ""}};
    this.postService.getAllPosts(paginationObj, this.selectedPostType ?this.selectedPostType : type ).pipe(
      map((result: any) => {
        if (result && result.posts) {
          /** Set the data for the datatable  */
          this.length = result.total;
          this.dataSource.data = result.posts;
        }
      })
    ).subscribe()
  }

}
