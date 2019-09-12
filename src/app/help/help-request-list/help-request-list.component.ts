import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { selectQueries, selectAllHelpRequestsList } from 'src/app/core/store/selectors/help.selectors';
import { GetHelpRequestsByUserId, DeleteHelpRequest, SetSelectedHelpRequest, GetAllHelpRequests } from 'src/app/core/store/actions/help.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute, PRIMARY_OUTLET, UrlSegment } from '@angular/router';
import { runInThisContext } from 'vm';
import { HelpService } from '../help.service';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';

@Component({
  selector: 'app-help-request-list',
  templateUrl: './help-request-list.component.html',
  styleUrls: ['./help-request-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HelpRequestListComponent implements OnInit, OnDestroy {

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  expandedHelpRequest: HelpQuery | null;
  all: boolean;


  userSubsription: Subscription;
  helpRequestsListSubscription: Subscription;

  helpQueryList$: Observable<HelpQuery[]>;

  breadcumb: BreadCumb;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  authorId: string; // Id of the user whose profile is being visited by loggedInUser

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private helpService: HelpService
  ) {
    this.breadcumb = {
      title: 'List of Help Requests',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'help-requests'
        }
      ]
    };
  }

  ngOnInit() {

    const path = this.activatedRoute.parent.routeConfig.path;

    // Checking if authorId is there to see if user is trying to visit somebody else's profile or his own profile(loggedin User's own Profile)
    this.authorId = this.activatedRoute.parent.snapshot.parent.params['authorId'];

    if (path === 'help-requests-all') {

      this.store.dispatch(GetAllHelpRequests());

      this.helpRequestsListSubscription = this.store.select(selectAllHelpRequestsList).pipe(
        map((helpRequests) => {
          if (helpRequests) {
            this.dataSource.data = helpRequests;
            this.displayedColumns = ['number', 'name', 'price', 'createdBy', 'category', 'createdAt'];
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

      this.store.dispatch(GetHelpRequestsByUserId({userId: (this.authorId ? this.authorId : this.authService.loggedInUser._id), status: status }));

      this.helpRequestsListSubscription = this.store.select(selectQueries).pipe(
        map((helpRequests) => {
          if (helpRequests) {
            this.dataSource.data = helpRequests;
          }
        })
      ).subscribe();
    }

    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.helpRequestsListSubscription) {
      this.helpRequestsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.userSubsription.unsubscribe();
    }
  }

  editHelpRequest(helpRequest): void {
    this.store.dispatch(SetSelectedHelpRequest({ helpRequest }));
    // this.router.navigate(['/add-helpRequest'], );
  }

  deleteHelpRequest(helpRequestId: string) {
    this.store.dispatch(DeleteHelpRequest({ helpRequestId }));
  }

  redirectToHelpRequestDetails(details) {
    this.router.navigate(['/', { outlets: { main: ['dashboard', 'help-request-details', details._id] } }]);
  }

  redirectTo(event) {
    console.log(event);
    this.helpService.redirectToHelpRequestDetails(event);
  }

}
