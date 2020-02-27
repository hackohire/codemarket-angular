import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators/tap';
import { User } from '../../shared/models/user.model';
import moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../shared/services/comment.service';
import { AuthService } from '../../core/services/auth.service';
import { ShareService } from '@ngx-share/core';
import { PostService } from '../../shared/services/post.service';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { CompanyService } from '../../companies/company.service';
import { MatDialog } from '@angular/material';
import { BlockToolData } from '@editorjs/editorjs';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { Post } from '../../shared/models/post.model';
import Storage from '@aws-amplify/storage';
import { appConstants } from '../../shared/constants/app_constants';
import { PostType } from '../../shared/models/post-types.enum';

enum navLinkName {
  howtoguide = 'how-to-guide',
  assignments = 'assignments'
}


@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {

  details: Post;

  view: string;

  navLinkName = navLinkName;
  collaborators: String[];
  postTypes = PostType;

  @ViewChild('coverPic', { static: false }) coverPic;
  @ViewChild('cover', { static: false }) cover: ElementRef;
  selectedCoverPic: File;
  selectedCoverPicURL = '';
  uploadedCoverUrl = '';

  isUserAttending: boolean; /** Only for the event */

  subscription$: Subscription = new Subscription();

  type: string;

  likeCount: number;
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;

  commentForm: FormGroup;
  commentsList: any[];

  commentId: string;

  postDescription: [{
    type: string;
    data: BlockToolData
  }];

  postsConnectedWithEvent: Post[];

  viewLinks = [
    {
      view: navLinkName.howtoguide,
      title: 'How to Docs',
      showAdd: true
    },
    {
      view: navLinkName.assignments,
      title: 'Assignments',
      showAdd: true
    },
    // {
    //   view: 'interested-people',
    //   title: 'Interested Professionals'
    // },
    {
      view: 'info',
      title: 'Info'
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    public commentService: CommentService,
    public authService: AuthService,
    public share: ShareService,
    public postService: PostService,
    private router: Router,
    private sweetAlertService: SweetalertService,
    private companyService: CompanyService,
    public auth: AuthService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
    this.breadcumb = {
      path: []
    };
  }

  ngOnInit() {

    /** show the type of the post in "breadcrumb" */
    this.breadcumb.path.push({ name: PostType.Event });

    this.commentId = this.activatedRoute.snapshot.queryParams['commentId'];

    const params = this.activatedRoute.snapshot.params;

    const postId = params && params.slug ? params.slug.split('-').pop() : '';

    this.view = this.activatedRoute.snapshot.queryParams['view'] ? this.activatedRoute.snapshot.queryParams['view'] : 'home';

    this.subscription$.add(this.store.select(selectSelectedPost).pipe(
      tap((p: Post) => {
        if (p) {
          this.details = p;
          this.collaborators = this.details.collaborators.map((cDetail) => {
            return cDetail._id;
          })
          this.initializeCommentForm(p, 'post');
          this.fetchPostsConnectedWithEvent(p);

          /** SHow company in breadcrumb */
          if (p.company && p.company.name) {
            this.breadcumb.path.unshift({ name: p.company.name });
          }

          /** Subscribe to loggedinuser, once loggedInUse is got, Check if the loggedInUder is
           * in the list of attendess or not
          */

          this.subscription$.add(
            this.authService.loggedInUser$.subscribe((user) => {
              if (this.details
                && this.details.usersAttending
                && this.details.usersAttending.length
                && this.details.usersAttending.find((u: User) => u._id === user._id)) {
                this.isUserAttending = true;
              } else {
                this.isUserAttending = false;
              }
            })
          );
        } else if (this.details && this.details._id === postId) {
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
      referenceId: new FormControl(),
      companyReferenceId: new FormControl(p._id),
      type: new FormControl(commentType ? commentType : this.type),
    });

    this.commentService.getCommentsByReferenceId(p, this.commentId);

  }

  async addComment(postId = '', commentEditor: EditorComponent) {
    console.log(this.commentForm.value);
    if (this.authService.loggedInUser) {
      const blocks =  await commentEditor.editor.save();
      this.commentForm.get('text').setValue(blocks.blocks);
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentForm.patchValue({referenceId: postId});
      this.subscription$.add(
        this.commentService.addComment(this.commentForm.value).subscribe(c => {
          if (c) {
            commentEditor.editor.clear();
          }
        })
      );
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
    }
  }

  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

  /** On Picture Added */
  onFilesAdded() {
    const pic: File = this.coverPic.nativeElement.files[0];
    this.selectedCoverPic = pic;
    this.selectedCoverPicURL = URL.createObjectURL(pic);
    console.log(pic);
  }

  async updateCover() {
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

    const details = {
      _id: this.details._id,
      cover: this.uploadedCoverUrl
    };
    this.postService.updatePost(details).subscribe(c => {
      this.details = c;
      this.selectedCoverPic = null;
      this.selectedCoverPicURL = '';
      this.uploadedCoverUrl = '';
    });
  }

  removeCover() {
    if (this.selectedCoverPic) {
      this.selectedCoverPic = null;
      this.selectedCoverPicURL = null;
      return;
    }
    this.uploadedCoverUrl = null;
    this.updateCover();
  }

  getDate(d: string) {
    return moment(d).isValid() ? moment(d) : moment(new Date(+d));
  }

  selectMainCategory(category, panel) {
    if (!category.types) {
      this.view = category.view;
      this.router.navigate(['./'], { relativeTo: this.activatedRoute, queryParams: { view: category.view }, queryParamsHandling: 'merge' });
    } else {
      panel.toggle();
    }
  }

  fetchPostsConnectedWithEvent(c) {
    this.postService.getAllPosts({ limit: 0, pageNumber: 0 }, '', {connectedEvent: c._id}).subscribe(c => {
      if (c && c.posts) {
        this.commentService.companyPostsList = c.posts;
        this.postsConnectedWithEvent = c.posts;
      }
    });
  }
}
