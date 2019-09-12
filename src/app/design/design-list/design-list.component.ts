import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Design } from 'src/app/shared/models/design.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { GetDesignsByUserId, DeleteDesign } from 'src/app/core/store/actions/design.actions';
import { selectDesignsList } from 'src/app/core/store/selectors/design.selectors';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-design-list',
  templateUrl: './design-list.component.html',
  styleUrls: ['./design-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DesignListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedDesign: Design | null;


  userSubsription: Subscription;
  designsListSubscription: Subscription;

  helpQueryList$: Observable<Design[]>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) { }

  ngOnInit() {

    this.userSubsription = this.authService.loggedInUser$.pipe(
      map((u) => {
        if (u) {
          this.store.dispatch(GetDesignsByUserId({ userId: u._id, status: ''}));
        }
      })
    ).subscribe();

    this.designsListSubscription = this.store.select(selectDesignsList).pipe(
      map((designs) => {
        if (designs) {
          this.dataSource.data = designs;
        }
      })
    ).subscribe();


    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.designsListSubscription) {
      this.designsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.designsListSubscription.unsubscribe();
    }
  }


  editDesign(design): void {
    // this.store.dispatch(SetSelectedDesign({design}));
    // this.router.navigate(['/add-design'], );
  }

  deleteDesign(designId: string) {
    this.store.dispatch(DeleteDesign({designId}));
  }

  redirectToDesignDetails(details) {
    this.router.navigate(['/', {outlets: {main: ['dashboard', 'design-details', details._id]}}]);
  }

}
