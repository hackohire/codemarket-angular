import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable, Subscription, of } from 'rxjs';
import { Post } from '../../shared/models/post.model';
import { environment } from '../../../environments/environment';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/store/state/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../shared/services/comment.service';
import { AuthService } from '../../core/services/auth.service';
import { MatDialog } from '@angular/material';
import { ShareService } from '@ngx-share/core';
import { PostService } from '../../shared/services/post.service';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { tap, map } from 'rxjs/operators';
import moment from 'moment';
import { AddJobComponent } from '../../job/add-job/add-job.component';
import { SetSelectedPost, GetPostById } from '../../core/store/actions/post.actions';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { PostType } from '../../shared/models/post-types.enum';

@Component({
  selector: 'app-dream-job-details',
  templateUrl: './dream-job-details.component.html',
  styleUrls: ['./dream-job-details.component.scss']
})
export class DreamJobDetailsComponent implements OnInit, OnDestroy {

  details$: Observable<Post>;

  postDetails: Post;
  isUserAttending: boolean; /** Only for the event */
  subscription$: Subscription = new Subscription();
  likeCount: number;
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;

  commentForm: FormGroup;
  commentsList: any[];

  commentId: string;

  connectedJobsList = []

  dreamJobView = '';
  dreamJobViewLinks = [
    {
      view: 'dream-job-details',
      title: 'Dream Job Details'
    },
    {
      view: 'jobs',
      title: 'Jobs'
    },
  ]

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public commentService: CommentService,
    public authService: AuthService,
    public share: ShareService,
    public postService: PostService,
    public dialog: MatDialog
  ) {
    this.breadcumb = {
      path: [{name: PostType.Dreamjob}]
    };

    /** Peer Subscription for Video Call */
    // this.userService.peer.subscribe((p) => {
    //   if (p) {
    //     console.log(p);
    //     this.peer = p;
    //   }
    // });
  }

  ngOnInit() {

    this.commentId = this.activatedRoute.snapshot.queryParams['commentId'];

    const view = this.activatedRoute.snapshot.queryParams['view'];

    this.dreamJobView = view ? view : 'dream-job-details';

    const params = this.activatedRoute.snapshot.params;

    const postId = params && params.slug ? params.slug.split('-').pop() : '';

    this.subscription$.add(this.store.select(selectSelectedPost).pipe(
      tap((p: Post) => {
        if (p) {
          this.postDetails = p;
          this.details$ = of(p);
          this.initializeCommentForm(p, PostType.Dreamjob);
          this.getJobsConnectedWithDreamJob(postId);
        } else if (this.postDetails && this.postDetails._id === postId) {
          /** Comes inside this block, only when we are already in a post details page, and by using searh,
           * we try to open any other post detials page
           */
        } else {
          this.store.dispatch(GetPostById({ postId }));
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
    // this.commentService.unsubscribe();
  }

  initializeCommentForm(p, commentType?: string) {
    this.commentForm = new FormGroup({
      text: new FormControl(''),
      referenceId: new FormControl(p._id),
      type: new FormControl(commentType ? commentType : PostType.Dreamjob),
    });

    this.commentService.getCommentsByReferenceId(p, this.commentId);

  }

  getDate(d: string) {
    return moment(d).isValid() ? d : new Date(+d);
  }


  async addComment(addCommentEditor: EditorComponent) {
    if (this.authService.loggedInUser) {
      const blocks =  await addCommentEditor.editor.save();
      this.commentForm.get('text').setValue(blocks.blocks);
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));

      this.subscription$.add(
        this.commentService.addComment(this.commentForm.value).subscribe(c => {
          if(c) {
            addCommentEditor.editor.blocks.clear();
          }
        })
      );
    } else {
      this.authService.checkIfUserIsLoggedIn(true);
    }
  }

  updateFormData(event) {
    this.commentForm.get('text').setValue(event);
  }

  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

  edit(details) {
    this.postService.editPost(details);
  }

  openAddJobDialog(referencePostId): void {
    const dialogRef = this.dialog.open(AddJobComponent, {
      width: '630px',
      height: '550px',
      maxHeight: '700px',
      panelClass: 'no-padding',
      data: {referencePostId},
      // disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.connectedJobsList.unshift(result);
      }
    });
  }

  getJobsConnectedWithDreamJob(postId) {
    this.postService.getAllPosts({limit: 0, pageNumber: 0}, 'job', postId).pipe(
      map((result: any) => {
        if (result && result.posts) {
          /** Set the data for the datatable  */
          console.log(result);
          this.connectedJobsList = result.posts;
        }
      })
    ).subscribe();
  }

  deleteJob(jobId) {
    this.connectedJobsList = this.connectedJobsList.filter((p: any) => p._id !== jobId);
  }


}
