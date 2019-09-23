import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Requirement } from 'src/app/shared/models/requirement.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { GetPostsByUserIdAndType, DeletePost } from 'src/app/core/store/actions/post.actions';
import { PostType } from 'src/app/shared/models/post-types.enum';
import { selectPostsByUserIdAndType } from 'src/app/core/store/selectors/post.selectors';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RequirementListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedRequirement: Requirement | null;


  userSubsription: Subscription;
  requirementsListSubscription: Subscription;

  helpQueryList$: Observable<Requirement[]>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router,
    public postService: PostService
  ) { }

  ngOnInit() {

    this.userSubsription = this.authService.loggedInUser$.pipe(
      map((u) => {
        if (u) {
          this.store.dispatch(GetPostsByUserIdAndType({ userId: u._id, status: '', postType: PostType.Requirement}));
        }
      })
    ).subscribe();

    this.requirementsListSubscription = this.store.select(selectPostsByUserIdAndType).pipe(
      map((requirements) => {
        if (requirements) {
          this.dataSource.data = requirements;
        }
      })
    ).subscribe();


    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.requirementsListSubscription) {
      this.requirementsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.requirementsListSubscription.unsubscribe();
    }
  }

  deleteRequirement(postId: string) {
    this.store.dispatch(DeletePost({postId}));
  }

}
