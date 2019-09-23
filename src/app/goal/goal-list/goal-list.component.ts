import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Goal } from 'src/app/shared/models/goal.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { GetPostsByUserIdAndType, DeletePost } from 'src/app/core/store/actions/post.actions';
import { PostType } from 'src/app/shared/models/post-types.enum';
import { selectPostsByUserIdAndType } from 'src/app/core/store/selectors/post.selectors';

@Component({
  selector: 'app-goal-list',
  templateUrl: './goal-list.component.html',
  styleUrls: ['./goal-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GoalListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedGoal: Goal | null;


  userSubsription: Subscription;
  goalsListSubscription: Subscription;

  helpQueryList$: Observable<Goal[]>;

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
          this.store.dispatch(GetPostsByUserIdAndType({ userId: u._id, status: '', postType: PostType.Goal}));
        }
      })
    ).subscribe();

    this.goalsListSubscription = this.store.select(selectPostsByUserIdAndType).pipe(
      map((goals) => {
        if (goals) {
          this.dataSource.data = goals;
        }
      })
    ).subscribe();


    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.goalsListSubscription) {
      this.goalsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.goalsListSubscription.unsubscribe();
    }
  }


  editGoal(goal): void {
    // this.store.dispatch(SetSelectedGoal({goal}));
    // this.router.navigate(['/add-goal'], );
  }

  deleteGoal(postId: string) {
    this.store.dispatch(DeletePost({postId}));
  }

  redirectToGoalDetails(details) {
    this.router.navigate(['/', {outlets: {main: ['dashboard', 'goal-details', details._id]}}]);
  }

}
