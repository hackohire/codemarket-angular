import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { GetProductsByUserId, SetSelectedProduct, DeleteProduct } from 'src/app/core/store/actions/product.actions';
import { AppState } from 'src/app/core/store/state/app.state';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Product } from 'src/app/shared/models/product.model';
import { selectProductsList } from 'src/app/core/store/selectors/product.selectors';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductsListComponent implements OnInit, OnDestroy {

  modules = {
    formula: true,
    // imageResize: {},
    syntax: true,
  };

  anonymousAvatar = require('src/assets/images/anonymous-avatar.jpg');
  codemarketBucketURL = environment.codemarketFilesBucket;

  all: boolean;

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  expandedProduct: Product | null;

  purchasedBy;

  userSubsription: Subscription;
  productsListSubscription: Subscription;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  breadcumb: BreadCumb;

  authorId: string; // Id of the user whose profile is being visited by loggedInUser

  constructor(
    private auth: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {

    const path = this.activatedRoute.parent.routeConfig.path;

    // Checking if authorId is there to see if user is trying to visit somebody else's profile or his own profile(loggedin User's own Profile)
    this.authorId = this.activatedRoute.parent.snapshot.parent.params['authorId'];


    if (path === 'bugfixes-all') {
      this.productsListSubscription = this.productService.getAllPosts().pipe(
        map((posts) => {
          if (posts) {
            /** Set the data for the datatable  */
            this.dataSource.data = posts;

            /** Set the columns visible in the table */
            this.displayedColumns = ['number', 'name', 'price', 'createdBy', 'type', 'category', 'createdAt'];
            this.all = true;
          }
        })
      ).subscribe();

    } else {

      let status = '';

      // If authorId is there, User is visiting somebody else's profile so we don't show action buttons
      if (this.authorId) {
        this.displayedColumns = ['number', 'name', 'price'];
        status = PostStatus.Published;
      } else {
        this.displayedColumns = ['number', 'name', 'price', 'status', 'action'];
      }

      this.store.dispatch(GetProductsByUserId(
        {
          userId: (this.authorId ? this.authorId : this.auth.loggedInUser._id),
          status: status 
        }));

      this.productsListSubscription = this.store.select(selectProductsList).pipe(
        map((products) => {
          if (products) {
            this.dataSource.data = products;
          }
        })
      ).subscribe();
    }

    this.breadcumb = {
      title: 'List of Bugfixes',
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
  }

  ngOnDestroy(): void {
    if (this.productsListSubscription) {
      this.productsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.userSubsription.unsubscribe();
    }
  }

  editProduct(product): void {
    this.store.dispatch(SetSelectedProduct({product}));
    // this.router.navigate(['/add-product'], );
  }

  deleteProduct(productId: string) {
    this.store.dispatch(DeleteProduct({productId}));
  }

  redirectTo(event) {
    console.log(event);
    this.productService.redirectToPostDetails(event);
  }

  getListOfUsersWhoPurchased(product: Product) {
    this.expandedProduct = this.expandedProduct === product ? null : product;
    if (this.expandedProduct === product) {
      this.productService.getListOfUsersWhoPurchased(product._id).subscribe((d) => {
        console.log(d);
        this.purchasedBy = d;
      });
    } else {
      this.purchasedBy = null;
    }
    // return product === this.expandedProduct ? 'expanded' : 'collapsed';
  }

  fromNow(date) {
    const d = new Date(+date);
    return moment(d).fromNow();
  }

}
