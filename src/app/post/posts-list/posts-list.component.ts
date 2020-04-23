import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { AuthService } from '../../core/services/auth.service';
import { map, switchMap } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { GetPostsByUserIdAndType, GetPostsByType, DeletePost } from '../../core/store/actions/post.actions';
import { selectPostsByUserIdAndType, selectPostsByType } from '../../core/store/selectors/post.selectors';
import { PostService } from '../../shared/services/post.service';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { startCase } from 'lodash';
import { selectLoggedInUser } from '../../core/store/selectors/user.selector';
import { SweetalertService } from '../../shared/services/sweetalert.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PostsListComponent implements OnInit, OnDestroy {

  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  expandedPost: Post | null;
  all: boolean;
  authorId: string;
  breadcumb: BreadCumb;


  userSubsription: Subscription;
  postsListSubscription: Subscription;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    public postService: PostService,
    private activatedRoute: ActivatedRoute,
    private sweetAlertService: SweetalertService
  ) { }

  ngOnInit() {

    this.all = JSON.parse(this.activatedRoute.snapshot.queryParams.all);

    const type: string = this.activatedRoute.snapshot.queryParams.type;
    this.breadcumb = {
      title: 'List of ' + startCase(type),
      path: [
        {
          name: 'Dashboard',
          pathString: '/',
        },
        {
          name: type
        }
      ]
    };

    if (this.all) {
      this.displayedColumns = ['number', 'name', 'price', 'createdBy', 'category', 'createdAt', 'action'];
      this.postsListSubscription = this.store.select(selectPostsByType).pipe(
        map((posts) => {
          if (posts) {
            this.dataSource.data = posts;
          }
        })
      ).subscribe();
      this.store.dispatch(GetPostsByType({ postType: type }));
    } else {

      /** Checking if authorId is there to see if user is trying to visit somebody else's
       * profile or his own profile(loggedin User's own Profile)
      **/

      this.authorId = this.activatedRoute.parent.snapshot.parent.params.authorId;

      if (this.authorId) {
        this.store.dispatch(GetPostsByUserIdAndType({ userId: this.authorId, status: '', postType: type }));
        this.displayedColumns = ['number', 'name', 'createdAt', 'price'];
      } else {
        this.store.select(selectLoggedInUser).subscribe((u) => {
          if (u) {
            this.store.dispatch(GetPostsByUserIdAndType({ userId: this.authService.loggedInUser._id, status: '', postType: type }));
          }
        });

        this.displayedColumns = ['number', 'name', 'price', 'status', 'createdAt', 'action'];
      }

      this.postsListSubscription = this.store.select(selectPostsByUserIdAndType).pipe(
        map((posts) => {
          if (posts) {
            this.dataSource.data = posts;
          }
        })
      ).subscribe();
    }

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
    this.sweetAlertService.confirmDelete(() => {
      this.store.dispatch(DeletePost({ postId, deletedBy: {name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id}}));
    });
  }

}
