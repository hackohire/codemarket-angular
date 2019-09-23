import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Interview } from 'src/app/shared/models/interview.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { GetPostsByUserIdAndType, DeletePost } from 'src/app/core/store/actions/post.actions';
import { PostType } from 'src/app/shared/models/post-types.enum';
import { selectPostsByUserIdAndType } from 'src/app/core/store/selectors/post.selectors';
import { PostService } from 'src/app/shared/services/post.service';

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
    private postService: PostService
  ) { }

  ngOnInit() {

    this.userSubsription = this.authService.loggedInUser$.pipe(
      map((u) => {
        if (u) {
          this.store.dispatch(GetPostsByUserIdAndType({ userId: u._id, status: '', postType: PostType.Interview}));
        }
      })
    ).subscribe();

    this.interviewsListSubscription = this.store.select(selectPostsByUserIdAndType).pipe(
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

  deleteInterview(postId: string) {
    this.store.dispatch(DeletePost({postId}));
  }

}
