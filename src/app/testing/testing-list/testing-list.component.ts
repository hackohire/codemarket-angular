import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Testing } from 'src/app/shared/models/testing.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { GetPostsByUserIdAndType, DeletePost } from 'src/app/core/store/actions/post.actions';
import { PostType } from 'src/app/shared/models/post-types.enum';
import { selectPostsByUserIdAndType } from 'src/app/core/store/selectors/post.selectors';

@Component({
  selector: 'app-testing-list',
  templateUrl: './testing-list.component.html',
  styleUrls: ['./testing-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TestingListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedTesting: Testing | null;


  userSubsription: Subscription;
  testingsListSubscription: Subscription;

  helpQueryList$: Observable<Testing[]>;

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
          this.store.dispatch(GetPostsByUserIdAndType({ userId: u._id, status: '', postType: PostType.Testing}));
        }
      })
    ).subscribe();

    this.testingsListSubscription = this.store.select(selectPostsByUserIdAndType).pipe(
      map((testings) => {
        if (testings) {
          this.dataSource.data = testings;
        }
      })
    ).subscribe();


    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.testingsListSubscription) {
      this.testingsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.testingsListSubscription.unsubscribe();
    }
  }


  editTesting(testing): void {
    // this.store.dispatch(SetSelectedTesting({testing}));
    // this.router.navigate(['/add-testing'], );
  }

  deleteTesting(postId: string) {
    this.store.dispatch(DeletePost({postId}));
  }

  redirectToTestingDetails(details) {
    this.router.navigate(['/', {outlets: {main: ['dashboard', 'testing-details', details._id]}}]);
  }

}
