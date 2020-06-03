import { Component, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { tap, map, share } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl } from '@angular/forms';
import moment from 'moment';
import { keyBy } from 'lodash';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { selectSelectedPost } from 'src/app/core/store/selectors/post.selectors';
import { Post } from 'src/app/shared/models/post.model';
import { MatDialog, MatPaginator } from '@angular/material';
import { VideoChatComponent } from 'src/app/video-chat/video-chat.component';
import { PostService } from '../../shared/services/post.service';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { appConstants } from '../../shared/constants/app_constants';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MdePopoverTrigger } from '@material-extended/mde';
import { ShareService } from '@ngx-share/core';

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
  subscription$: Subscription = new Subscription();
  type: string; // product | help-request | interview | requirement | Testing | Howtodoc
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;

  commentForm: FormGroup;
  postForm: FormGroup;
  commentsList: any[];
  collaborators: string[];
  // peer: Peer;

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

  displayChatBox = false;

  @ViewChild(MdePopoverTrigger, { static: false }) addTagsPopover: MdePopoverTrigger;
  @ViewChild(MdePopoverTrigger, { static: false }) addCopmaniesPopover: MdePopoverTrigger;
  @ViewChild(MdePopoverTrigger, { static: false }) addClientsPopover: MdePopoverTrigger;
  @ViewChild(MdePopoverTrigger, { static: false }) addCollaboratorsPopover: MdePopoverTrigger;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public commentService: CommentService,
    public authService: AuthService,
    private dialog: MatDialog,
    public postService: PostService,
    private router: Router,
    public shareSocial: ShareService,
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

    this.authService.selectedPostId = postId;

    this.subscription$.add(this.store.select(selectSelectedPost).pipe(
      tap((p: Post) => {
        if (p) {
          this.postDetails = p;
          this.collaborators = this.postDetails.collaborators.map((cDetail) => {
            return cDetail._id;
          });
          this.details$ = of(p);
          this.initializeCommentForm(p, 'post');
          this.postFormInitialization(p);

          this.breadcumb = {
            path: [
              {
                name: p.type,
                pathString: '/'
              }
            ]
          };

          this.postService.getCountOfAllPost('', '',
            {
              referencePostId: [this.postDetails._id],
              connectedPosts: this.postDetails.connectedPosts.map(p => p._id),
              postType: null
            }).subscribe((data) => {
              if (data.length) {
                data = keyBy(data, '_id');
                appConstants.postTypesArray.forEach((obj) => {
                  obj['count'] = data[obj.name] ? data[obj.name].count : 0
                });
              }
            });

        }

      })
    ).subscribe()
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

  postFormInitialization(i: Post) {
    this.postForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : ''),
      tags: new FormControl(i && i.tags ? i.tags : []),
      companies: new FormControl(i && i.companies ? i.companies : []),
      clients: new FormControl(i && i.clients ? i.clients : []),
      collaborators: new FormControl(i && i.collaborators ? i.collaborators : []),
    });
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
      // data: { authorId, peer: this.peer },
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

  showCommentsOnSide(event: { block: any, comments, selectedPost }) {
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

  onChatClicked() {
    this.displayChatBox = true;
  }

  allowUsersEdit = () => {
    const loggedInUser = this.authService.loggedInUser;
    return loggedInUser && loggedInUser._id && this.postDetails && this.postDetails._id && (loggedInUser._id === this.postDetails.createdBy._id || this.postDetails.collaborators.find(c => c._id === loggedInUser._id));
  }

  addDataOfPost(data) {
    const postObj = {
      _id: this.postDetails._id,
    };
    if (data === 'tags') {
      postObj['tags'] = this.postForm.controls.tags.value;
      this.postService.updatePost(
        postObj,
        { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
      ).subscribe((j) => {
        if (j && j.tags) {
          this.postDetails.tags = j.tags;
          this.addTagsPopover.closePopover();
        }
      });
    }

    if (data === 'companies') {
      postObj['companies'] = this.postForm.controls.companies.value;
      this.postService.updatePost(
        postObj,
        { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
      ).subscribe((j) => {
        if (j && j.companies) {
          this.postDetails.companies = j.companies;
          this.addCopmaniesPopover.closePopover();
        }
      });
    }

    if (data === 'clients') {
      postObj['clients'] = this.postForm.controls.clients.value;
      this.postService.updatePost(
        postObj,
        { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
      ).subscribe((j) => {
        if (j && j.clients) {
          this.postDetails.clients = j.clients;
          this.addClientsPopover.closePopover();
        }
      });
    }

    if (data === 'collaborators') {
      postObj['collaborators'] = this.postForm.controls.collaborators.value;
      this.postService.updatePost(
        postObj,
        { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
      ).subscribe((j) => {
        if (j && j.collaborators) {
          this.postDetails.collaborators = j.collaborators;
          this.addCollaboratorsPopover.closePopover();
        }
      });
    }
  }
}
