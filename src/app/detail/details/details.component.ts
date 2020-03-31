import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { tap, map, share } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl } from '@angular/forms';
import moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { selectSelectedPost } from 'src/app/core/store/selectors/post.selectors';
import { SetSelectedPost } from 'src/app/core/store/actions/post.actions';
import { Post } from 'src/app/shared/models/post.model';
import { MatDialog, MatPaginator } from '@angular/material';
import { VideoChatComponent } from 'src/app/video-chat/video-chat.component';
import Peer from 'peerjs';
import { PostService } from '../../shared/services/post.service';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Company } from '../../shared/models/company.model';
import { User } from '../../shared/models/user.model';
import { appConstants } from '../../shared/constants/app_constants';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [CommentService]
})
export class DetailsComponent implements OnInit, OnDestroy {

  @ViewChild('successfulRSVP', { static: false }) successfulRSVP: SwalComponent;
  details$: Observable<Post>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  postTypesArray = appConstants.postTypesArray;

  postDetails: Post;
  isUserAttending: boolean; /** Only for the event */
  subscription$: Subscription = new Subscription();
  type: string; // product | help-request | interview | requirement | Testing | Howtodoc
  likeCount: number;
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;

  commentForm: FormGroup;
  commentsList: any[];
  collaborators: string[];
  peer: Peer;

  commentId: string;
  blockId: string;

  listOfConnectedPosts: { posts: Post[], total?: number } = { posts: [] };
  totalOtherPosts: number;
  paginator: MatPaginator;

  showConnectedPosts = false;
  selectedPostType = '';

  selectedBlock = null;

  selectedPost: Post;
  selectedPostComments: Observable<Comment[]>;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public commentService: CommentService,
    public authService: AuthService,
    private dialog: MatDialog,
    public postService: PostService,
    private router: Router,
    private sweetAlertService: SweetalertService,
    private breakpointObserver: BreakpointObserver,
  ) {
    /** Peer Subscription for Video Call */
    // this.userService.peer.subscribe((p) => {
    //   if (p) {
    //     console.log(p);
    //     this.peer = p;
    //   }
    // });
  }

  ngOnInit() {
    /** Read the type of the post  */
    this.type = this.activatedRoute.snapshot.queryParams.type;

    this.commentId = this.activatedRoute.snapshot.queryParams['commentId'];
    this.blockId = this.activatedRoute.snapshot.queryParams['blockId'];

    console.log(this.activatedRoute.snapshot.queryParams);

    const params = this.activatedRoute.snapshot.params;

    const postId = params && params.slug ? params.slug.split('-').pop() : '';

    this.subscription$.add(this.store.select(selectSelectedPost).pipe(
      tap((p: Post) => {
        if (p) {
          this.postDetails = p;
          this.collaborators = this.postDetails.collaborators.map((cDetail) => {
            return cDetail._id;
          })
          this.details$ = of(p);
          this.initializeCommentForm(p, 'post');

          /** SHow company in breadcrumb */
          // if (p.companies && p.companies.length) {
          //   this.breadcumb.path.unshift({ name: p.type });
          // }

          /** Subscribe to loggedinuser, once loggedInUse is got, Check if the loggedInUder is
           * in the list of attendess or not
           **/

          this.breadcumb = {
            path: [
              {
                name: p.type,
                pathString: '/'
              }
            ]
          };

          this.subscription$.add(
            this.authService.loggedInUser$.subscribe((user) => {
              if (this.postDetails
                && this.postDetails.usersAttending
                && this.postDetails.usersAttending.length
                && this.postDetails.usersAttending.find((u: User) => u._id === user._id)) {
                this.isUserAttending = true;
              } else {
                this.isUserAttending = false;
              }
            })
          );
        } else if (this.postDetails && this.postDetails._id === postId) {
          /** Comes inside this block, only when we are already in a post details page, and by using searh,
           * we try to open any other post detials page
           */
        } else {
          // this.store.dispatch(GetPostById({ postId }));
          // this.details$ = this.store.select(selectSelectedPost);
        }

      })
    ).subscribe()
    );

  }

  async rsvpEvent(eventId) {
    if (!this.authService.loggedInUser) {
      /** calling this method to set current url as redirectURL after user is logged In */
      await this.authService.checkIfUserIsLoggedIn(true);
    } else {
      /** Make the API call to set the user in the list of attendees */
      this.subscription$.add(
        this.postService.rsvpEvent(eventId).pipe(
          tap(d => console.log(d))
        ).subscribe({
          next: (d) => {
            console.log(d);
            /** If user doesn't have subscription, rediret to membership page */
            if (d && !d.validSubscription) {
              this.router.navigate(['/', { outlets: { main: ['membership'] } }]);
            }

            /** Check i user is in the list of attendees */
            if (d && d.usersAttending && d.usersAttending.length) {
              this.isUserAttending = true;
              this.postDetails.usersAttending = d.usersAttending;
              this.store.dispatch(SetSelectedPost({ post: this.postDetails }));
              const isLoggedInUserAttending = d.usersAttending.find((u) => u._id === this.authService.loggedInUser._id);
              if (isLoggedInUserAttending) {
                this.successfulRSVP.show();
              }
            }
          },
          error: (e) => console.log(e)
        })
      );
    }
  }

  cancelRSVP(eventId: string) {
    this.subscription$.add(
      this.postService.cancelRSVP(eventId).subscribe((e) => {
        console.log(e);
        if (e && e.usersAttending && e.usersAttending) {
          const isCustomerGoing = e.usersAttending.find(u => u._id === this.authService.loggedInUser._id);
          if (!isCustomerGoing) {
            this.isUserAttending = false;
            this.postDetails.usersAttending = e.usersAttending;
            this.store.dispatch(SetSelectedPost({ post: this.postDetails }));
            this.sweetAlertService.success('Successful Cancel RSVP Request', '', 'success');
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
      // this.store.dispatch(SetSelectedPost({ post: null }));
    }
    /** Unsubscribes from Comments Related Subscription */
    this.commentService.unsubscribe();
  }

  initializeCommentForm(p, commentType?: string) {
    this.commentForm = new FormGroup({
      text: new FormControl(''),
      referenceId: new FormControl(p._id),
      type: new FormControl(commentType ? commentType : this.type),
    });

    this.commentService.getCommentsByReferenceId(p, this.commentId);

    if (this.blockId) {
      this.selectedBlock = this.postDetails.description.find((b: any) => b._id === this.blockId);
      console.log(this.selectedBlock);
    }

  }

  getDate(d: string) {
    return moment(d).isValid() ? d : new Date(+d);
  }




  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

  openDialog(authorId?: string): void {
    this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: { authorId, peer: this.peer },
      disableClose: true
    });
  }

  edit(details) {
    this.postService.editPost(details);
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  redirectToAddPost(p, postType) {
    this.router.navigate(['../add-post'], { relativeTo: this.activatedRoute, state: { post: p }, queryParams: { type: postType } });
  }

  showCommentsOnSide(event: { block: any, comments, selectedPost}) {
    console.log(event);
    this.selectedBlock = event.block;
    this.selectedPostComments = event.comments;
    this.selectedPost = event.selectedPost;
  }

  getConnectedPosts(postType) {
    this.showConnectedPosts = true;
    this.selectedPostType = postType;

    if (this.paginator) {
      const paginationObj = {
        pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
        sort: { order: '' }
      };

      this.postService.getAllPosts(
        paginationObj, '',
        {
          referencePostId: [this.postDetails._id],
          connectedPosts: this.postDetails.connectedPosts.map(p => p._id),
          postType
        }
      ).subscribe((u) => {
        this.listOfConnectedPosts.posts = u.posts;
        this.totalOtherPosts = u.total;
      });
    }
  }

}
