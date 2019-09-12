import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Interview } from 'src/app/shared/models/interview.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { GetInterviewsByUserId, DeleteInterview } from 'src/app/core/store/actions/interview.actions';
import { selectInterviewsList } from 'src/app/core/store/selectors/interview.selectors';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interview-list',
  templateUrl: './interview-list.component.html',
  styleUrls: ['./interview-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InterviewListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedInterview: Interview | null;


  userSubsription: Subscription;
  interviewsListSubscription: Subscription;

  helpQueryList$: Observable<Interview[]>;

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
          this.store.dispatch(GetInterviewsByUserId({ userId: u._id, status: ''}));
        }
      })
    ).subscribe();

    this.interviewsListSubscription = this.store.select(selectInterviewsList).pipe(
      map((interviews) => {
        if (interviews) {
          this.dataSource.data = interviews;
        }
      })
    ).subscribe();


    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.interviewsListSubscription) {
      this.interviewsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.interviewsListSubscription.unsubscribe();
    }
  }


  editInterview(interview): void {
    // this.store.dispatch(SetSelectedInterview({interview}));
    // this.router.navigate(['/add-interview'], );
  }

  deleteInterview(interviewId: string) {
    this.store.dispatch(DeleteInterview({interviewId}));
  }

  redirectToInterviewDetails(details) {
    this.router.navigate(['/', {outlets: {main: ['dashboard', 'interview-details', details._id]}}]);
  }

}
