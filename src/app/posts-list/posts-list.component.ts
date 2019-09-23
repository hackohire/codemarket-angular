import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { Observable, Subscription } from 'rxjs';
import { Post } from 'src/app/shared/models/post.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { GetPostsByUserIdAndType, DeletePost } from 'src/app/core/store/actions/post.actions';
import { selectPostsByUserIdAndType } from 'src/app/core/store/selectors/post.selectors';
import { PostService } from 'src/app/shared/services/post.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PostsListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['number', 'name', 'price', 'status', 'action'];
  dataSource = new MatTableDataSource();
  expandedPost: Post | null;


  userSubsription: Subscription;
  postsListSubscription: Subscription;

  helpQueryList$: Observable<Post[]>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    public postService: PostService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.userSubsription = this.authService.loggedInUser$.pipe(
      map((u) => {
        if (u) {
          const type = this.activatedRoute.snapshot.queryParams.type;
          this.store.dispatch(GetPostsByUserIdAndType({ userId: u._id, status: '', postType: type}));
        }
      })
    ).subscribe();

    this.postsListSubscription = this.store.select(selectPostsByUserIdAndType).pipe(
      map((posts) => {
        if (posts) {
          this.dataSource.data = posts;
        }
      })
    ).subscribe();


    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    if (this.postsListSubscription) {
      this.postsListSubscription.unsubscribe();
    }

    if (this.userSubsription) {
      this.postsListSubscription.unsubscribe();
    }
  }


  editPost(post): void {
    // this.store.dispatch(SetSelectedPost({post}));
    // this.router.navigate(['/add-post'], );
  }

  deletePost(postId: string) {
    this.store.dispatch(DeletePost({postId}));
  }

}
