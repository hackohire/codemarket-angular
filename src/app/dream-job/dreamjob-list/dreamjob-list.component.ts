import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { Subscription } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { AuthService } from '../../core/services/auth.service';
import { map } from 'rxjs/operators';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { GetPostsByUserIdAndType, GetPostsByType, DeletePost } from '../../core/store/actions/post.actions';
import { selectPostsByUserIdAndType, selectPostsByType } from '../../core/store/selectors/post.selectors';
import { PostService } from '../../shared/services/post.service';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { startCase } from 'lodash';
import { selectLoggedInUser } from '../../core/store/selectors/user.selector';
import { SweetalertService } from '../../shared/services/sweetalert.service';

@Component({
  selector: 'app-dreamjob-list',
  templateUrl: './dreamjob-list.component.html',
  styleUrls: ['./dreamjob-list.component.scss']
})
export class DreamjobListComponent implements OnInit {

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
    public authService: AuthService,
    private store: Store<AppState>,
    public postService: PostService,
    private activatedRoute: ActivatedRoute,
    private sweetAlertService: SweetalertService
  ) { }

  ngOnInit() {

    this.all = JSON.parse(this.activatedRoute.snapshot.queryParams.all);
    this.displayedColumns = ['number', 'name', 'company', 'expectedSalary', 'cities', 'createdBy', 'status', 'createdAt', 'action'];

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
      this.postsListSubscription = this.store.select(selectPostsByType).pipe(
        map((posts) => {
          if (posts) {
            this.dataSource.data = posts;
          }
        })
      ).subscribe();
      this.store.dispatch(GetPostsByType({ postType: type }));
    } else {
        this.store.select(selectLoggedInUser).subscribe((u) => {
          if (u) {
            this.store.dispatch(GetPostsByUserIdAndType({ userId: this.authService.loggedInUser._id, status: '', postType: type }));
          }
        });

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
      this.store.dispatch(DeletePost({ postId }));
    });
  }


}
