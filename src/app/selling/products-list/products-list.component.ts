import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { GetProductsByUserId } from 'src/app/core/store/actions/product.actions';
import { AppState } from 'src/app/core/store/state/app.state';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Product } from 'src/app/shared/models/product.model';
import { selectProductsList } from 'src/app/core/store/selectors/product.selectors';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

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

  modules: any;

  displayedColumns: string[] = ['number', 'name', 'price'];
  dataSource = new MatTableDataSource();
  expandedProduct: Product | null;

  productsList: Product[];

  userSubsription: Subscription;
  productsListSubscription: Subscription;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private auth: AuthService,
    private store: Store<AppState>
  ) {

    this.userSubsription = this.auth.loggedInUser$.subscribe((u) => {
      if (u) {
        this.store.dispatch(new GetProductsByUserId());
      }
    });

    this.productsListSubscription = this.store.select(selectProductsList).subscribe((products: Product[]) => {
      if (products) {
        this.dataSource.data = products;
      }
    });
  }

  ngOnInit() {
    this.modules = {
      formula: true,
      // imageResize: {},
      syntax: true,
    };
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.userSubsription.unsubscribe();
    this.productsListSubscription.unsubscribe();
  }

}
