import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { GetAllProducts } from '../core/store/actions/product.actions';
import { Observable } from 'rxjs';
import { Product } from '../shared/models/product.model';
import { selectAllProductsList } from '../core/store/selectors/product.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  productsList$: Observable<Product[]>;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(GetAllProducts());
    this.productsList$ = this.store.select(selectAllProductsList);
  }

}
