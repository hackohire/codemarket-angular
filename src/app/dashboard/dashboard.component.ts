import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../core/store/state/app.state';
import { GetAllProducts } from '../core/store/actions/product.actions';
import { Observable } from 'rxjs';
import { Product } from '../shared/models/product.model';
import { selectAllProductsList } from '../core/store/selectors/product.selectors';
import { MatTableDataSource } from '@angular/material/table';
import { HelpQuery } from '../shared/models/help-query.model';
import { GetAllHelpRequests } from '../core/store/actions/help.actions';
import { selectAllHelpRequestsList } from '../core/store/selectors/help.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  productsList$: Observable<Product[]>;
  helpRequestList$: Observable<HelpQuery[]>;

  displayedColumns: string[] = ['number', 'name', 'price', 'thumbnail', 'createdBy', 'createdAt'];
  dataSource = new MatTableDataSource();

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(GetAllProducts());
    this.store.dispatch(GetAllHelpRequests());
    this.productsList$ = this.store.select(selectAllProductsList);
    this.helpRequestList$ = this.store.select(selectAllHelpRequestsList);
  }

}
