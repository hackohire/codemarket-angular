import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Design } from 'src/app/shared/models/design.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { GetPostsByUserIdAndType, DeletePost } from 'src/app/core/store/actions/post.actions';
import { PostType } from 'src/app/shared/models/post-types.enum';
import { selectPostsByUserIdAndType } from 'src/app/core/store/selectors/post.selectors';

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
          this.store.dispatch(GetPostsByUserIdAndType({ userId: u._id, status: '', postType: PostType.Design}));
        }
      })
    ).subscribe();

    this.designsListSubscription = this.store.select(selectPostsByUserIdAndType).pipe(
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

  deleteDesign(postId: string) {
    this.store.dispatch(DeletePost({postId}));
  }

  redirectToDesignDetails(details) {
    this.router.navigate(['/', {outlets: {main: ['dashboard', 'design-details', details._id]}}]);
  }

}
