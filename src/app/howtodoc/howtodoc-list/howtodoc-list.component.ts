import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Howtodoc } from 'src/app/shared/models/howtodoc.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { GetPostsByUserIdAndType, DeletePost } from 'src/app/core/store/actions/post.actions';
import { PostType } from 'src/app/shared/models/post-types.enum';
import { selectPostsByUserIdAndType } from 'src/app/core/store/selectors/post.selectors';

@Component({
  selector: 'app-howtodoc-list',
  templateUrl: './howtodoc-list.component.html',
  styleUrls: ['./howtodoc-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HowtodocListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedHowtodoc: Howtodoc | null;


  userSubsription: Subscription;
  howtodocsListSubscription: Subscription;

  helpQueryList$: Observable<Howtodoc[]>;

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
          this.store.dispatch(GetPostsByUserIdAndType({ userId: u._id, status: '', postType: PostType.Howtodoc}));
        }
      })
    ).subscribe();

    this.howtodocsListSubscription = this.store.select(selectPostsByUserIdAndType).pipe(
      map((howtodocs) => {
        if (howtodocs) {
          this.dataSource.data = howtodocs;
        }
      })
    ).subscribe();


    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.howtodocsListSubscription) {
      this.howtodocsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.howtodocsListSubscription.unsubscribe();
    }
  }


  editHowtodoc(howtodoc): void {
    // this.store.dispatch(SetSelectedHowtodoc({howtodoc}));
    // this.router.navigate(['/add-howtodoc'], );
  }

  deleteHowtodoc(postId: string) {
    this.store.dispatch(DeletePost({postId}));
  }

  redirectToHowtodocDetails(details) {
    this.router.navigate(['/', {outlets: {main: ['dashboard', 'howtodoc-details', details._id]}}]);
  }

}
