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

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedProduct: Product | null;


  userSubsription: Subscription;
  productsListSubscription: Subscription;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private auth: AuthService,
    private store: Store<AppState>
  ) {

    this.userSubsription = this.auth.loggedInUser$.pipe(
      map((u) => {
        if (u) {
          this.store.dispatch(GetProductsByUserId());
        }
      })
    ).subscribe();

    this.productsListSubscription = this.store.select(selectProductsList).pipe(
      map((products) => {
        if (products) {
          this.dataSource.data = products;
        }
      })
    ).subscribe();
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.productsListSubscription) {
      this.productsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.productsListSubscription.unsubscribe();
    }
  }

  editProduct(product): void {
    this.store.dispatch(SetSelectedProduct({product}));
    // this.router.navigate(['/add-product'], );
  }

  deleteProduct(productId: string) {
    this.store.dispatch(DeleteProduct({productId}));
  }

}
