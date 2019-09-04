import { Component, OnInit } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { selectPurchasedItemsList } from 'src/app/core/store/selectors/cart.selectors';
import { Observable } from 'rxjs';
import { GetPurchasedItemsByUser } from 'src/app/core/store/actions/cart.actions';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-purchased-items-list',
  templateUrl: './purchased-items-list.component.html',
  styleUrls: ['./purchased-items-list.component.scss']
})
export class PurchasedItemsListComponent implements OnInit {

  breadcumb: BreadCumb;
  purchasedItems: any[];
  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.breadcumb = {
      title: 'List of Purchased Items',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'My Profile',
          // pathString: '/'
        },
        {
          name: 'purchased-items'
        }
      ]
    };

    this.store.select(selectPurchasedItemsList).pipe(
      tap((l: any[]) => {
        if (l) {
          this.purchasedItems = l.map((r) => r.reference_id);
        }
      })
    ).subscribe();
    this.store.dispatch(GetPurchasedItemsByUser());
  }

  redirectTo(event) {

  }

}
