import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { selectQueries } from 'src/app/core/store/selectors/help.selectors';
import { GetHelpRequestsByUserId, DeleteHelpRequest, SetSelectedHelpRequest } from 'src/app/core/store/actions/help.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-request-list',
  templateUrl: './help-request-list.component.html',
  styleUrls: ['./help-request-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HelpRequestListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedHelpRequest: HelpQuery | null;


  userSubsription: Subscription;
  helpRequestsListSubscription: Subscription;

  helpQueryList$: Observable<HelpQuery[]>;

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
          this.store.dispatch(GetHelpRequestsByUserId());
        }
      })
    ).subscribe();

    this.helpRequestsListSubscription = this.store.select(selectQueries).pipe(
      map((helpRequests) => {
        if (helpRequests) {
          this.dataSource.data = helpRequests;
        }
      })
    ).subscribe();


    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.helpRequestsListSubscription) {
      this.helpRequestsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.helpRequestsListSubscription.unsubscribe();
    }
  }

  editHelpRequest(helpRequest): void {
    this.store.dispatch(SetSelectedHelpRequest({helpRequest}));
    // this.router.navigate(['/add-helpRequest'], );
  }

  deleteHelpRequest(helpRequestId: string) {
    this.store.dispatch(DeleteHelpRequest({helpRequestId}));
  }

  redirectToHelpRequestDetails(details) {
    this.router.navigate(['/', {outlets: {main: ['dashboard', 'help-request-details', details._id]}}]);
  }

}
