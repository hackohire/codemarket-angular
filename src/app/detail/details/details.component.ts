import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { Requirement } from 'src/app/shared/models/requirement.model';
import { Interview } from 'src/app/shared/models/interview.model';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { tap, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl } from '@angular/forms';
import moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { ShareService } from '@ngx-share/core';
import { Testing } from 'src/app/shared/models/testing.model';
import { Howtodoc } from 'src/app/shared/models/howtodoc.model';
import { selectSelectedPost } from 'src/app/core/store/selectors/post.selectors';
import { GetPostById, SetSelectedPost } from 'src/app/core/store/actions/post.actions';
import { Post } from 'src/app/shared/models/post.model';
import { UserService } from 'src/app/user/user.service';
import { MatDialog } from '@angular/material';
import { VideoChatComponent } from 'src/app/video-chat/video-chat.component';
import Peer from 'peerjs';
import { PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [ShareService]
})
export class DetailsComponent implements OnInit, OnDestroy {

  details$: Observable<HelpQuery | Requirement | Interview | Testing | Howtodoc>;
  subscription$: Subscription;
  type: string; // product | help-request | interview | requirement | Testing | Howtodoc
  commentsList: any[];
  likeCount: number;
  anonymousAvatar = require('src/assets/images/anonymous-avatar.jpg');
  codemarketBucketURL = environment.codemarketFilesBucket;

  breadcumb: BreadCumb;

  commentForm: FormGroup;

  peer: Peer;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    public authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    public share: ShareService,
    private postService: PostService
  ) {
    this.breadcumb = {
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        }
      ]
    };

    /** Peer Subscription for Video Call */
    this.userService.peer.subscribe((p) => {
      if (p) {
        console.log(p);
        this.peer = p;
      }
    });
  }

  ngOnInit() {

    this.type = this.activatedRoute.snapshot.queryParams['type'];

    console.log(this.activatedRoute.snapshot.queryParams);

    const params = this.activatedRoute.snapshot.params;

    this.subscription$ = this.store.select(selectSelectedPost).pipe(
      tap((p: Post) => {
        if (p) {
          this.details$ = of(p);
          // this.type = ;
          this.initializeCommentForm(p);

        } else {
          const postId = this.activatedRoute.snapshot.queryParams['postId'];
          this.store.dispatch(GetPostById({ postId }));
          this.details$ = this.store.select(selectSelectedPost);
        }

      })
    ).subscribe();

  }

  async rsvpEvent(eventId) {
    if (!this.authService.loggedInUser) {
      /** calling this method to set current url as redirectURL after user is logged In */
      await this.authService.checkIfUserIsLoggedIn(true);
    } else {
      this.postService.rsvpEvent(this.authService.loggedInUser._id, eventId).pipe(
        tap(d => console.log(d))
      ).subscribe({
        next: (d) => console.log(d),
        error: (e) => console.log(e)
      })
    }
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
      this.store.dispatch(SetSelectedPost({ post: null }));
    }
  }

  initializeCommentForm(p) {
    this.commentForm = new FormGroup({
      text: new FormControl(''),
      referenceId: new FormControl(p._id),
      type: new FormControl(this.type),
    });

    this.commentService.getCommentsByReferenceId(p._id).pipe(
      tap((d) => {
        this.commentsList = d;
      })
    ).subscribe();
  }

  getDate(d: string) {
    return new Date(+d);
  }


  addComment() {
    console.log(this.commentForm.value);
    if (this.authService.loggedInUser) {
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentService.addComment(this.commentForm.value).pipe(
        switchMap((d) => {
          return this.commentService.getCommentsByReferenceId(d.referenceId);
        }),
        tap((d) => {
          console.log(d);
          if (d && d.length) {
            this.commentsList = d;
          }
        })
      ).subscribe();
    }
  }

  updateFormData(event) {
    this.commentForm.get('text').setValue(event);
  }

  fromNow(date) {
    const d = new Date(+date);
    return moment(d).fromNow();
  }

  openDialog(authorId?: string): void {
    const dialogRef = this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: { authorId, peer: this.peer },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
