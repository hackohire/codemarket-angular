import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { HelpQuery } from 'src/app/shared/models/help-query.model';
import { Requirement } from 'src/app/shared/models/requirement.model';
import { Interview } from 'src/app/shared/models/interview.model';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { tap, switchMap } from 'rxjs/operators';
import { GetHelpRequestById } from 'src/app/core/store/actions/help.actions';
import { ActivatedRoute } from '@angular/router';
import { selectSelectedQuery } from 'src/app/core/store/selectors/help.selectors';
import { GetInterviewById } from 'src/app/core/store/actions/interview.actions';
import { selectSelectedInterview } from 'src/app/core/store/selectors/interview.selectors';
import { selectSelectedRequirement } from 'src/app/core/store/selectors/requirement.selectors';
import { GetRequirementById } from 'src/app/core/store/actions/requirement.actions';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { ShareService } from '@ngx-share/core';
import { Testing } from 'src/app/shared/models/testing.model';
import { GetTestingById } from 'src/app/core/store/actions/testing.actions';
import { selectSelectedTesting } from 'src/app/core/store/selectors/testing.selectors';
import { Howtodoc } from 'src/app/shared/models/howtodoc.model';
import { selectSelectedHowtodoc } from 'src/app/core/store/selectors/howtodoc.selectors';
import { GetHowtodocById } from 'src/app/core/store/actions/howtodoc.actions';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [ShareService]
})
export class DetailsComponent implements OnInit {

  details$: Observable<HelpQuery | Requirement | Interview | Testing | Howtodoc>;
  subscription$: Subscription;
  type: string; // product | help-request | interview | requirement | Testing | Howtodoc
  commentsList: any[];

  anonymousAvatar = require('src/assets/images/anonymous-avatar.jpg');
  codemarketBucketURL = environment.codemarketFilesBucket;

  breadcumb: BreadCumb;

  commentForm: FormGroup;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    private authService: AuthService,
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

    const params = this.activatedRoute.snapshot.params;

    if (params['helpRequestId']) {

      this.subscription$ = this.store.select(selectSelectedQuery).pipe(
        tap((p: HelpQuery) => {
          if (p) {
            this.details$ = of(p);
            this.type = 'help-request'
            this.initializeCommentForm(p);
          } else {
            const params = this.activatedRoute.snapshot.params;
            this.store.dispatch(GetHelpRequestById({ helpRequestId: params.helpRequestId }));
            this.details$ = this.store.select(selectSelectedQuery);
          }

        })
      ).subscribe();

    } else if (params['interviewId']) {
      this.subscription$ = this.store.select(selectSelectedInterview).pipe(
        tap((p: Interview) => {
          if (p) {
            this.details$ = of(p);
            this.type = 'interview';
            this.initializeCommentForm(p);
          } else {
            this.store.dispatch(GetInterviewById({ interviewId: params.interviewId }));
            this.details$ = this.store.select(selectSelectedInterview);
          }
        })
      ).subscribe();

    } else if (params['requirementId']) {
      this.subscription$ = this.store.select(selectSelectedRequirement).pipe(
        tap((p: Requirement) => {
          if (p) {
            this.details$ = of(p);
            this.type = 'requirement';
            this.initializeCommentForm(p);
          } else {
            this.store.dispatch(GetRequirementById({ requirementId: params.requirementId }));
            this.details$ = this.store.select(selectSelectedRequirement);
          }
        })
      ).subscribe();
    } else if (params['testingId']) {
      this.subscription$ = this.store.select(selectSelectedTesting).pipe(
        tap((p: Testing) => {
          if (p) {
            this.details$ = of(p);
            this.type = 'testing';
            this.initializeCommentForm(p);
          } else {
            this.store.dispatch(GetTestingById({ testingId: params.testingId }));
            this.details$ = this.store.select(selectSelectedTesting);
          }
        })
      ).subscribe();
    } else if (params['howtodocId']) {
      this.subscription$ = this.store.select(selectSelectedHowtodoc).pipe(
        tap((p: Howtodoc) => {
          if (p) {
            this.details$ = of(p);
            this.type = 'howtodoc';
            this.initializeCommentForm(p);
          } else {
            this.store.dispatch(GetHowtodocById({ howtodocId: params.howtodocId }));
            this.details$ = this.store.select(selectSelectedHowtodoc);
          }
        })
      ).subscribe();
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
