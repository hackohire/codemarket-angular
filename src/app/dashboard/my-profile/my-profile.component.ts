import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { User } from '../../shared/models/user.model';
import { Observable, Subscription, of } from 'rxjs';
import { VideoChatComponent } from '../../video-chat/video-chat.component';
import { MatDialog, MatPaginator } from '@angular/material';
import Peer from 'peerjs';
import { PostType } from '../../shared/models/post-types.enum';
import { map } from 'rxjs/operators';
import { PostService } from '../../shared/services/post.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Post } from '../../shared/models/post.model';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import moment from 'moment';
import { CommentService } from '../../shared/services/comment.service';
import { FormGroup, FormControl } from '@angular/forms';
import { appConstants } from '../../shared/constants/app_constants';
import Storage from '@aws-amplify/storage';

enum navLinkName {
  home = 'home',
  buy = 'buy',
  sell = 'sell',
  info = 'info',
  membership = 'membership',
  posts = 'posts',
  myrsvp = 'my-rsvp',
  events = 'events',
  dreamjobs = 'dream-jobs',
  businessgoal = 'business-goal',
  startupgoal = 'startup-goal',
  technicalgoal = 'technical-goal',
  socialimpactgoal = 'social-impact-goal',
  businesschallenge = 'business-challenge',
  technicalchallenge = 'technical-challenge',
  leadershipchallenge = 'leadership-challenge'
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  /** Creating Separate Instance for User Service & Comment Service is very important, Because we are creating the instances of
   * User's posts and then mutating it, for realtime post & comment => add / edit / delete
   */
  providers: [],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed', style({ height: '0px', display: 'none' })),
      state('expanded', style({ height: '*', display: 'block' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
  ],
})
export class MyProfileComponent implements OnInit {

  breadcumb: BreadCumb;
  navLinks = [];
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;
  authorId: string;

  userData$: Observable<User>;

  postTypesArray = appConstants.postTypesArray;
  postTypes = PostType;

  peer: Peer;

  subscription = new Subscription();

  profileView: string;

  navLinkName = navLinkName;

  listOfAllOtherPosts: { posts: Post[], total?: number } = { posts: [] };
  totalOtherPosts: number;
  paginator: MatPaginator;

  selectedBlock = null;

  selectedPost: Post;
  selectedPostComments: Observable<Comment[]>;

  commentForm: FormGroup;

  @ViewChild('coverPic', { static: false }) coverPic;
  @ViewChild('cover', { static: false }) cover: ElementRef;
  selectedCoverPic: File;
  selectedCoverPicURL = '';
  uploadedCoverUrl = '';

  @ViewChild('profilePic', { static: false }) profilePic;
  selectedProfilePic: File;
  selectedProfilePicURL = '';

  profileViewLinks = [
    // {
    //   view: navLinkName.home,
    //   title: 'Home',
    // },
    {
      view: navLinkName.buy,
      title: 'Buy',
      path: 'purchased-items-list',
      showOnlyToLoggedInUser: true
    },
    {
      view: navLinkName.sell,
      title: 'Sell',
      path: 'products-list',
    },
    {
      view: navLinkName.membership,
      title: 'Membership',
      path: 'membership-list',
      showOnlyToLoggedInUser: true
    },
    {
      view: navLinkName.myrsvp,
      title: 'My RSVP',
      path: 'my-rsvp',
      showOnlyToLoggedInUser: true
    },
    // {
    //   view: navLinkName.events,
    //   title: 'Events'
    // },
    // {
    //   view: navLinkName.dreamjobs,
    //   title: 'Dream Jobs'
    // },
    {
      view: navLinkName.posts,
      title: 'Posts'
    },
    {
      view: navLinkName.info,
      title: 'Info'
    },
  ];

  constructor(
    private commentService: CommentService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    public postService: PostService
  ) {

    this.breadcumb = {
      title: 'Profile',
      path: [
        {
          name: 'My Profile'
        }
      ]
    };

    /** Peer Subscription for Video Call */
    // this.subscription.add(
    //   this.userService.peer.asObservable().subscribe((p) => {
    //     if (p) {
    //       console.log(p);
    //       this.peer = p;
    //     }
    //   })
    // );
  }

  deletePost(_id: string) {
    this.postService.deletePost(_id).subscribe();
  }

  ngOnInit() {
    this.authorId = this.activatedRoute.snapshot.params.authorId;

    this.profileView = this.activatedRoute.snapshot.queryParams['view'] ? this.activatedRoute.snapshot.queryParams['view'] : 'posts';

    // If user is visitng somebody else's profile
    if (this.authorId) {
      // this.navLinks = this.navLinks.filter(n => !n.showOnlyToLoggedInUser);
      this.userData$ = this.userService.getUserById(this.authorId);
      // this.fetchPostsConnectedWithUser(this.authorId);

      // this.userService.onUsersPostChanges(this.authorId);
      // this.commentService.onCommentAdded({ user: { _id: this.authorId } }, []);
      // this.commentService.onCommentUpdated({ user: { _id: this.authorId } }, []);
      // this.commentService.onCommentDeleted({ user: { _id: this.authorId } }, []);

      this.initializeCommentForm(this.authorId, 'post');

    } else {
      this.userData$ = this.authService.loggedInUser$;

      this.subscription.add(
        this.authService.loggedInUser$.pipe(
          map((user) => {
            if (user) {
              // this.fetchPostsConnectedWithUser(user._id);
              // this.userService.onUsersPostChanges(user._id);
              // this.commentService.onCommentAdded({ user }, []);
              // this.commentService.onCommentUpdated({ user }, []);
              // this.commentService.onCommentDeleted({ user }, []);
              this.initializeCommentForm(user._id, 'post');
            }
          })
        ).subscribe()
      );
    }

    this.userService.peer.asObservable().subscribe((p) => {
      if (p) {
        console.log(p);
        this.peer = p;
      }
    });
  }

  createTabs() {
    // this.navLinks = [ ];

    // If user is visiting somebody else's profile don't show what other user has bought
    if (!this.authorId) {
      this.navLinks.push(
        {
          path: 'purchased-items-list',
          label: 'Buy'
        },
        {
          path: 'products-list',
          label: 'Sell'
        },
        {
          path: 'membership-list',
          label: 'Membership'
        },
        {
          path: 'my-rsvp',
          label: 'My RSVP'
        }
      );
      // this.router.navigate(['purchased-items-list'], { relativeTo: this.activatedRoute });
    } else {
      this.navLinks.push(
        {
          path: 'products-list',
          label: 'Sell'
        },
        {
          path: 'post-list',
          label: 'Request Help',
          queryParams: { type: PostType.HelpRequest, all: false }
        },
      );
      // this.router.navigate(['products-list'], { relativeTo: this.activatedRoute });
    }
  }

  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

  openDialog(): void {
    this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: { authorId: this.authorId, peer: this.userService.peer.value },
      disableClose: true
    });
  }

  initializeCommentForm(userId, commentType?: string) {
    this.commentForm = new FormGroup({
      text: new FormControl(''),
      referenceId: new FormControl(),
      userReferenceId: new FormControl(userId),
      type: new FormControl(commentType),
    });
  }

  async addComment(postId = '', addCommentEditor: EditorComponent) {
    console.log(this.commentForm.value);
    if (this.authService.loggedInUser) {
      const blocks = await addCommentEditor.editor.save();
      this.commentForm.get('text').setValue(blocks.blocks);

      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentForm.patchValue({ referenceId: postId });
      this.subscription.add(
        this.commentService.addComment(this.commentForm.value).subscribe(c => {
          if (c) {
            addCommentEditor.editor.clear();
          }
        })
      );
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
    }
  }

  selectMainCategory(category) {
    if (!category.types) {
      this.profileView = category;
      this.router.navigate(['./'],
        {
          relativeTo: this.activatedRoute,
          queryParams: { view: category }, queryParamsHandling: 'merge'
        });
    }
  }

  showCommentsOnSide(event: { block: any, comments, selectedPost}) {
    console.log(event);
    this.selectedBlock = event.block;
    this.selectedPostComments = event.comments;
    this.selectedPost = event.selectedPost;
  }

  redirectToAddPost(postType) {
    this.router.navigate(['./post/add-post'], { queryParams: { type: postType } });
  }

  /** Fetch the list of posts for the posts tab based on the pagination */
  fetchAllOtherPosts(postType = '') {
    const userId = this.authorId ? this.authorId : this.authService.loggedInUser._id;
    const paginationObj = {
      pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      sort: {order: ''}};
    this.postService.getAllPosts(paginationObj, postType, '', '', userId, userId).subscribe((u) => {
      this.listOfAllOtherPosts.posts = u.posts;
      this.totalOtherPosts = u.total;
    });
  }

  addProfilePic() {
    this.profilePic.nativeElement.click();
  }

  onProfilePicAdded() {
    const pic: File = this.profilePic.nativeElement.files[0];
    this.selectedProfilePic = pic;
    this.selectedProfilePicURL = URL.createObjectURL(pic);
  }

  async updateProfilePicture(userId) {
    let uploadedProfilePicURL = '';

    if (this.selectedProfilePic) {
      const fileNameSplitArray = this.selectedProfilePic.name.split('.');
      const fileExt = fileNameSplitArray.pop();
      const fileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;

      await Storage.vault.put(fileName, this.selectedProfilePic, {

        bucket: appConstants.fileS3Bucket,
        path: 'avatar',
        level: 'public',
        contentType: this.selectedProfilePic.type,
      }).then((uploaded: any) => {
        console.log('uploaded', uploaded);
        uploadedProfilePicURL = uploaded.key;
      });
    }

    const userDetails = {
      _id: userId,
      avatar: uploadedProfilePicURL
    };

    this.userService.updateUser(userDetails).subscribe((u) => {
      if (u) {
        this.userData$ = of(u);
        this.selectedProfilePic = null;
        this.selectedProfilePicURL = '';
      }
    });
  }

  removeProfilePic(userId: string) {
    if (this.selectedProfilePic) {
      this.selectedProfilePic = null;
      this.selectedProfilePicURL = null;
      return;
    }
    this.updateProfilePicture(userId);
  }

  /** On Picture Added */
  onFilesAdded() {
    const pic: File = this.coverPic.nativeElement.files[0];
    this.selectedCoverPic = pic;
    this.selectedCoverPicURL = URL.createObjectURL(pic);
    console.log(pic);
  }

  async updateCover(userId: string) {
    if (this.selectedCoverPic) {
      const fileNameSplitArray = this.selectedCoverPic.name.split('.');
      const fileExt = fileNameSplitArray.pop();
      const fileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;
      await Storage.vault.put(fileName, this.selectedCoverPic, {

        bucket: appConstants.fileS3Bucket,
        path: 'cover',
        level: 'public',
        contentType: this.selectedCoverPic.type,
      }).then((uploaded: any) => {
        console.log('uploaded', uploaded);
        this.uploadedCoverUrl = uploaded.key;
      });
    }

    const userDetails = {
      _id: userId,
      cover: this.uploadedCoverUrl
    };

    this.userService.updateUser(userDetails).subscribe((u) => {
      if (u) {
        this.userData$ = of(u);
        this.selectedCoverPic = null;
        this.selectedCoverPicURL = '';
        this.uploadedCoverUrl = '';
      }
    });
  }

  removeCover(userId: string) {
    if (this.selectedCoverPic) {
      this.selectedCoverPic = null;
      this.selectedCoverPicURL = null;
      return;
    }
    this.uploadedCoverUrl = null;
    this.updateCover(userId);
  }

}
