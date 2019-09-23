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
import * as moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { ShareService } from '@ngx-share/core';
import { Testing } from 'src/app/shared/models/testing.model';
import { Howtodoc } from 'src/app/shared/models/howtodoc.model';
import { selectSelectedPost } from 'src/app/core/store/selectors/post.selectors';
import { GetPostById, SetSelectedPost } from 'src/app/core/store/actions/post.actions';
import { Post } from 'src/app/shared/models/post.model';

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

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    public authService: AuthService,
    public share: ShareService
  ) {
    this.breadcumb = {
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        }
      ]
    };
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

    // if (params['helpRequestId']) {

    //   this.subscription$ = this.store.select(selectSelectedPost).pipe(
    //     tap((p: HelpQuery) => {
    //       if (p) {
    //         this.details$ = of(p);
    //         this.type = PostType.HelpRequest;
    //         this.initializeCommentForm(p);
    //       } else {
    //         const params = this.activatedRoute.snapshot.params;
    //         this.store.dispatch(GetPostById({ postId: params.helpRequestId }));
    //         this.details$ = this.store.select(selectSelectedPost);
    //       }

    //     })
    //   ).subscribe();

    // } else if (params['interviewId']) {
    //   this.subscription$ = this.store.select(selectSelectedPost).pipe(
    //     tap((p: Interview) => {
    //       if (p) {
    //         this.details$ = of(p);
    //         this.type = PostType.Interview;
    //         this.initializeCommentForm(p);
    //       } else {
    //         this.store.dispatch(GetPostById({ postId: params.interviewId }));
    //         this.details$ = this.store.select(selectSelectedPost);
    //       }
    //     })
    //   ).subscribe();

    // } else if (params['requirementId']) {
    //   this.subscription$ = this.store.select(selectSelectedPost).pipe(
    //     tap((p: Requirement) => {
    //       if (p) {
    //         this.details$ = of(p);
    //         this.type = PostType.Requirement;
    //         this.initializeCommentForm(p);
    //       } else {
    //         this.store.dispatch(GetPostById({ postId: params.requirementId }));
    //         this.details$ = this.store.select(selectSelectedPost);
    //       }
    //     })
    //   ).subscribe();
    // } else if (params['testingId']) {
    //   this.subscription$ = this.store.select(selectSelectedPost).pipe(
    //     tap((p: Testing) => {
    //       if (p) {
    //         this.details$ = of(p);
    //         this.type = PostType.Testing;
    //         this.initializeCommentForm(p);
    //       } else {
    //         this.store.dispatch(GetPostById({ postId: params.testingId }));
    //         this.details$ = this.store.select(selectSelectedPost);
    //       }
    //     })
    //   ).subscribe();
    // } else if (params['howtodocId']) {
    //   this.subscription$ = this.store.select(selectSelectedPost).pipe(
    //     tap((p: Howtodoc) => {
    //       if (p) {
    //         this.details$ = of(p);
    //         this.type = PostType.Howtodoc;
    //         this.initializeCommentForm(p);
    //       } else {
    //         this.store.dispatch(GetPostById({ postId: params.howtodocId }));
    //         this.details$ = this.store.select(selectSelectedPost);
    //       }
    //     })
    //   ).subscribe();
    // } else if (params['designId']) {
    //   this.subscription$ = this.store.select(selectSelectedPost).pipe(
    //     tap((p: Design) => {
    //       if (p) {
    //         this.details$ = of(p);
    //         this.type = PostType.Design;
    //         this.initializeCommentForm(p);
    //       } else {
    //         this.store.dispatch(GetPostById({ postId: params.designId }));
    //         this.details$ = this.store.select(selectSelectedPost);
    //       }
    //     })
    //   ).subscribe();
    // } else if (params['goalId']) {
    //   this.subscription$ = this.store.select(selectSelectedPost).pipe(
    //     tap((p: Goal) => {
    //       if (p) {
    //         this.details$ = of(p);
    //         this.type = PostType.Goal;
    //         this.initializeCommentForm(p);
    //       } else {
    //         this.store.dispatch(GetPostById({ postId: params.goalId }));
    //         this.details$ = this.store.select(selectSelectedPost);
    //       }
    //     })
    //   ).subscribe();
    // }

  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
      this.store.dispatch(SetSelectedPost({post: null}));
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

}
