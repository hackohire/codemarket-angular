import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user/user.service';
import { User } from '../../shared/models/user.model';
import { Observable, Subscription, of } from 'rxjs';
import { VideoChatComponent } from '../../video-chat/video-chat.component';
import { MatDialog } from '@angular/material';
import Peer from 'peerjs';
import { PostType } from '../../shared/models/post-types.enum';
import { switchMap, tap } from 'rxjs/operators';
import { PostService } from '../../shared/services/post.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Post } from '../../shared/models/post.model';
import { PostStatus } from '../../shared/models/poststatus.enum';
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
  providers: [CommentService, UserService],
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
  porfileData: any;

  peer: Peer;

  subscription = new Subscription();

  profileView: string;

  navLinkName = navLinkName;

  postsUnderUser: Post[];

  listOfEvents$: Observable<{ posts: Post[], total: number }>;
  listOfDreamJobs$: Observable<{ posts: Post[], total: number }>;

  commentForm: FormGroup;

  @ViewChild('coverPic', { static: false }) coverPic;
  @ViewChild('cover', { static: false }) cover: ElementRef;
  selectedCoverPic: string = '';
  uploadedCoverUrl: string = '';

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
    {
      view: navLinkName.events,
      title: 'Events'
    },
    {
      view: navLinkName.dreamjobs,
      title: 'Dream Jobs'
    },
    {
      view: 'goals',
      title: 'Goals',
      types: [
        {
          view: navLinkName.businessgoal,
          title: 'Business Goals'
        },
        {
          view: navLinkName.startupgoal,
          title: 'Startup Goals'
        },
        {
          view: navLinkName.technicalgoal,
          title: 'Technical Goals'
        }
      ]
    },
    {
      view: navLinkName.socialimpactgoal,
      title: 'Social Impact Goals'
    },
    {
      view: 'challenges',
      title: 'Challenges',
      types: [
        {
          view: navLinkName.leadershipchallenge,
          title: 'Leadership Challenges'
        },
        {
          view: navLinkName.technicalchallenge,
          title: 'Technical Challenges'
        },
        {
          view: navLinkName.businesschallenge,
          title: 'Business Challenges'
        }
      ]
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
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'My Profile'
        }
      ]
    };

    /** Peer Subscription for Video Call */
    // this.subscription.add(
    //   this.userService.peer.subscribe((p) => {
    //     if (p) {
    //       console.log(p);
    //       this.peer = p;
    //     }
    //   })
    // );
  }

  async addPost(type: string, addPostEditor: EditorComponent) {
    if (this.authService.loggedInUser) {
      const blocks =  await addPostEditor.editor.save();
      const post: any = {
        type,
        createdBy: this.authService.loggedInUser._id,
        description: blocks.blocks,
        isPostUnderUser: true,
        connectedWithUser: this.authorId ? this.authorId : this.authService.loggedInUser._id,
        status: PostStatus.Published,
      };
      this.postService.addPost(post).subscribe(p => {
        if (p) {
          addPostEditor.editor.clear();
        }
      });
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
    }
  }

  deletePost(_id: string) {
    this.postService.deletePost(_id).subscribe();
  }

  isExpanded(category) {
    if (category && category.types) {
      return category.types.indexOf(c => c.view === this.profileView) > 0;
    }
    return false;
  }

  async updatePost(post, singlePostEditor: EditorComponent) {
    const blocks =  await singlePostEditor.editor.save();
    const postToBeUpdated = {};
    postToBeUpdated['description'] = blocks.blocks;
    postToBeUpdated['_id'] = post._id;
    postToBeUpdated['isPostUnderUser'] = true;
    this.postService.updatePost(postToBeUpdated).subscribe();
  }

  ngOnInit() {
    this.authorId = this.activatedRoute.snapshot.params.authorId;

    this.profileView = this.activatedRoute.snapshot.queryParams['view'] ? this.activatedRoute.snapshot.queryParams['view'] : 'info';

    // If user is visitng somebody else's profile
    if (this.authorId) {
      // this.navLinks = this.navLinks.filter(n => !n.showOnlyToLoggedInUser);
      this.userData$ = this.userService.getUserById(this.authorId);
      this.fetchPostsConnectedWithUser(this.authorId);

      this.userService.onUsersPostChanges(this.authorId);
      this.commentService.onCommentAdded({user: {_id: this.authorId}}, []);
      this.commentService.onCommentUpdated({user: {_id: this.authorId}}, []);
      this.commentService.onCommentDeleted({user: {_id: this.authorId}}, []);

      this.initializeCommentForm(this.authorId, 'post');

      this.subscription.add(
        this.userService.getMyProfileInfo(this.authorId).subscribe(d => {
          this.porfileData = d;
        })
      );
    } else {
      this.userData$ = this.authService.loggedInUser$;

      this.subscription.add(
        this.authService.loggedInUser$.pipe(
          switchMap((user) => {
            if (user) {
              this.fetchPostsConnectedWithUser(user._id);
              this.userService.onUsersPostChanges(user._id);
              this.commentService.onCommentAdded({user}, []);
              this.commentService.onCommentUpdated({user}, []);
              this.commentService.onCommentDeleted({user}, []);
              this.initializeCommentForm(user._id, 'post');
              return this.userService.getMyProfileInfo(user._id);
            }
            return of(null);
          }),
          tap((d) => {
            if (d) {
              this.porfileData = d;
            }
          })
        ).subscribe()
      );
    }
    this.createTabs();

    // this.userService.peer.subscribe((p) => {
    //   if (p) {
    //     console.log(p);
    //     this.peer = p;
    //   }
    // });
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

    this.navLinks.push(
      {
        path: 'business-coaches',
        label: 'Business Coach',
        queryParams: { userId: this.authorId }
      },
      {
        path: 'career-coaches',
        label: 'Career Coach',
        queryParams: { userId: this.authorId }
      }
    );
  }

  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

  openDialog(): void {
    this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: { authorId: this.authorId, peer: this.peer },
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
      const blocks =  await addCommentEditor.editor.save();
      this.commentForm.get('text').setValue(blocks.blocks);

      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentForm.patchValue({referenceId: postId});
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

  selectMainCategory(category, panel) {
    if (!category.types) {
      this.profileView = category.view;
      this.router.navigate([category && category.path ? category.path : './'],
        {
          relativeTo: this.activatedRoute,
          queryParams: { view: category.view }, queryParamsHandling: 'merge'
        });
    } else {
      panel.toggle();
    }

    switch (category.view) {
      case navLinkName.events:
        this.listOfEvents$ = this.postService.getPostsByUserIdAndType(
          this.authorId ? this.authorId : this.authService.loggedInUser._id,
          PostStatus.Published,
          PostType.Event
        );
        break;

      case navLinkName.dreamjobs:
        this.listOfDreamJobs$ = this.postService.getPostsByUserIdAndType(
          this.authorId ? this.authorId : this.authService.loggedInUser._id,
          PostStatus.Published,
          PostType.Dreamjob
        );
        break;

    }
  }

  fetchPostsConnectedWithUser(userId) {
    this.postService.getAllPosts({ limit: 0, pageNumber: 0 }, '', '', '', userId).subscribe(c => {
      if (c && c.posts) {
        this.postsUnderUser = c.posts;
        this.commentService.usersPostsList = c.posts;
      }
    });
  }

  /** On Picture Added */
  onFilesAdded() {
    // const files: { [key: string]: File } = this.file.nativeElement.files;
    const pic: File = this.coverPic.nativeElement.files[0];
    this.selectedCoverPic = window.URL.createObjectURL(pic);
    console.log(pic);

    const fileNameSplitArray = pic.name.split('.');
    const fileExt = fileNameSplitArray.pop();
    const fileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;

    Storage.vault.put(fileName, pic, {

      bucket: appConstants.fileS3Bucket,
      path: 'cover',
      level: 'public',

      contentType: pic.type,

    }).then((uploaded: any) => {
      console.log(uploaded);
      console.log('uploaded', uploaded);
      this.uploadedCoverUrl = uploaded.key;
    });


    // this.coverPic.nativeElement.value = null;

    // console.log(this.files);
  }

  updateCover(userId: string) {
    const userDetails = {
      _id: userId,
      cover: this.uploadedCoverUrl
    };
    this.userService.updateUser(userDetails).subscribe((u) => {
      if(u) {
        this.userData$ = of(u);
      }
    });
  }


}
