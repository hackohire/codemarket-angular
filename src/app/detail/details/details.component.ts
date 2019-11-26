import { Component, OnInit, OnDestroy, ViewChild, ViewChildren } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { tap, switchMap, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl } from '@angular/forms';
import moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { ShareService } from '@ngx-share/core';
import { selectSelectedPost } from 'src/app/core/store/selectors/post.selectors';
import { GetPostById, SetSelectedPost, UpdatePost } from 'src/app/core/store/actions/post.actions';
import { Post } from 'src/app/shared/models/post.model';
import { UserService } from 'src/app/user/user.service';
import { MatDialog } from '@angular/material';
import { VideoChatComponent } from 'src/app/video-chat/video-chat.component';
import Peer from 'peerjs';
import { PostService } from '../../shared/services/post.service';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CompanyService } from '../../companies/company.service';
import { Company } from '../../shared/models/company.model';
import { User } from '../../shared/models/user.model';
import { Storage } from 'aws-amplify';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [ShareService]
})
export class DetailsComponent implements OnInit, OnDestroy {

  @ViewChild('successfulRSVP', { static: false }) successfulRSVP: SwalComponent;
  details$: Observable<Post>;

  /** Company Details Related Varibale */
  companyDetails$: Observable<Company>;
  usersInterestedInCompany: User[];
  companyView: string;
  @ViewChild('coverPic', { static: false }) coverPic;
  selectedCoverPic: string = '';
  uploadedCoverUrl: string = '';



  postDetails: Post | Company | any;
  isUserAttending: boolean; /** Only for the event */
  subscription$: Subscription = new Subscription();
  type: string; // product | help-request | interview | requirement | Testing | Howtodoc
  likeCount: number;
  anonymousAvatar = require('src/assets/images/anonymous-avatar.jpg');
  codemarketBucketURL = environment.codemarketFilesBucket;

  breadcumb: BreadCumb;

  commentForm: FormGroup;
  commentsList: any[];

  peer: Peer;

  /** Q&A Related Variables */
  questionOrAnswerForm: FormGroup;
  questionsList: any[];
  answerData: [];
  questionData: [];

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private commentService: CommentService,
    public authService: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    public share: ShareService,
    public postService: PostService,
    private router: Router,
    private sweetAlertService: SweetalertService,
    private companyService: CompanyService
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

    this.type = this.activatedRoute.snapshot.queryParams.type;

    console.log(this.activatedRoute.snapshot.queryParams);

    const params = this.activatedRoute.snapshot.params;

    const postId = params && params.slug ? params.slug.split('-').pop() : '';

    if (this.type === 'company') {
      this.subscription$.add(
        this.companyService.getCompanyById(params.companyId).subscribe({
          next: (c: Company) => {
            this.companyDetails$ = of(c);
            this.postDetails = c;
            this.initializeCommentForm(c, 'company');
            this.initializeQuestionAndAnswerForm(c, 'company');

            this.subscription$.add(
              this.companyService.getListOfUsersInACompany(params.companyId).subscribe((u) => {
                console.log(u);
                if (u) {
                  this.usersInterestedInCompany = u;
                }
              })
            );
          }
        })
      );

      this.subscription$.add(
        this.activatedRoute.queryParams.subscribe((q) => {
          if (q && q.view) {
            this.companyView = q.view;
          } else {
            this.router.navigate(['./'], { queryParams: { view: 'description' }, queryParamsHandling: 'merge', relativeTo: this.activatedRoute })
          }
        })
      );
    } else {
      this.subscription$.add(this.store.select(selectSelectedPost).pipe(
        tap((p: Post) => {
          if (p) {
            this.postDetails = p;
            this.details$ = of(p);
            // this.type = ;
            this.initializeCommentForm(p, 'post');
            this.initializeQuestionAndAnswerForm(p, 'post');

            /** Subscribe to loggedinuser, once loggedInUse is got, Check if the loggedInUder is
             * in the list of attendess or not
             **/

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
            )
          } else if (this.postDetails && this.postDetails._id === postId) {
            /** Comes inside this block, only when we are already in a post details page, and by using searh,
             * we try to open any other post detials page
             */
          } else {
            this.store.dispatch(GetPostById({ postId }));
            this.details$ = this.store.select(selectSelectedPost);
          }

        })
      ).subscribe()
      );
    }
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
      this.store.dispatch(SetSelectedPost({ post: null }));
    }
  }

  initializeCommentForm(p, commentType?: string) {
    this.commentForm = new FormGroup({
      text: new FormControl(''),
      referenceId: new FormControl(p._id),
      type: new FormControl(commentType ? commentType : this.type),
    });

    this.subscription$.add(
      this.commentService.getCommentsByReferenceId(p._id).pipe(
        tap((d) => {
          this.commentsList = d;
        })
      ).subscribe({
        error: (e) => console.log(e)
      })
    );
  }

  getDate(d: string) {
    return new Date(+d);
  }


  addComment() {
    console.log(this.commentForm.value);
    if (this.authService.loggedInUser) {
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));

      this.subscription$.add(
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
        ).subscribe()
      );
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
    this.dialog.open(VideoChatComponent, {
      width: '550px',
      data: { authorId, peer: this.peer },
      disableClose: true
    });
  }

  edit(details) {
    if (this.type === 'company') {
      this.companyService.editCompany(details);
    } else {
      this.postService.editPost(details);
    }
  }


  /** Initializing Question & Answer Form */
  initializeQuestionAndAnswerForm(p, questionType?: string) {
    this.questionOrAnswerForm = new FormGroup({
      text: new FormControl(''),
      referenceId: new FormControl(p._id),
      type: new FormControl(questionType ? questionType : this.type),
      isQuestion: new FormControl(),
      isAnswer: new FormControl()
    });

    this.subscription$.add(
      this.commentService.getQuestionAndAnswersByReferenceId(p._id).pipe(
        tap((d) => {
          this.questionsList = d;
        })
      ).subscribe({
        error: (e) => console.log(e)
      })
    );
  }

  /** Add Question Or Answer */
  addQuestionOrAnswer(isQuestion, question = null) {
    console.log(this.questionOrAnswerForm.value);
    if (this.authService.loggedInUser) {
      this.questionOrAnswerForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.questionOrAnswerForm.get('isQuestion').setValue(isQuestion);
      this.questionOrAnswerForm.get('isAnswer').setValue(!isQuestion);

      /** Add questionId form control if adding answer, otherwise remove it */
      if (!isQuestion) {
        this.questionOrAnswerForm.addControl('questionId', new FormControl(question._id));
      } else {
        this.questionOrAnswerForm.removeControl('questionId');
      }

      this.subscription$.add(
        this.commentService.addQuestionOrAnswer(this.questionOrAnswerForm.value).pipe(
          map((d) => {
            console.log(d);
            if (d) {
              if (d.isQuestion) {
                this.questionsList.push(d);
              } else if (d.isAnswer) {
                question.answers.push(d)
              }
            }

          }),
        ).subscribe()
      );
    }
  }

  /** Update Question And Answer
   * @param qa - object if question / answer
   * @param isAnswer - to check if the object is qustion / answer
   */
  updateQuestionOrAnswer(qa, isAnswer) {
    this.commentService.updateQuestionOrAnswer(qa._id, isAnswer ? this.answerData : this.questionData).pipe(
      tap((d) => {
        console.log(d);
        if (d) {
          qa['edit'] = false;
          qa.text = d.text
        }
      })
    ).subscribe();
  }


  /** Delete Question Or Answer */
  deleteQuestionOrAnswer(answerOrQuestion) {
    this.sweetAlertService.confirmDelete(() => {
      this.commentService.deleteQuestionOrAnswer(answerOrQuestion._id).pipe(
        tap((d) => {
          console.log(d);
          if (d) {
            if (answerOrQuestion && answerOrQuestion.isAnswer) {
              console.log(answerOrQuestion.answers);
              answerOrQuestion.answers = [...answerOrQuestion.answers.filter(temp => answerOrQuestion._id !== temp._id)];
              console.log(answerOrQuestion.answers);
            } else {
              this.questionsList = this.questionsList.filter(temp => answerOrQuestion._id !== temp._id)
            }
          }
        })
      ).subscribe()
    });
  }

  /** On Picture Added */
  onFilesAdded() {
    // const files: { [key: string]: File } = this.file.nativeElement.files;
    const pic: File = this.coverPic.nativeElement.files[0];
    this.selectedCoverPic = URL.createObjectURL(pic);
    console.log(pic);

    const fileNameSplitArray = pic.name.split('.');
    const fileExt = fileNameSplitArray.pop();
    const fileName = fileNameSplitArray[0] + '-' + new Date().toISOString() + '.' + fileExt;

    Storage.vault.put(fileName, pic, {

      bucket: 'codemarket-files',
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

  resize(e) {
    console.log(e);

    if (e.target) {
      // e.target.style.left = e.clientX - e.target.offsetWidth / 2 + 'px';
      // e.target.style.top = e.clientY - e.target.offsetHeight / 2 + 'px';
      const top = e.offsetY;
      const left = e.offsetX;

      var y1 = 300;
      var y2 = e.target.naturalHeight;
      var x1 = 820
      var x2 = e.target.naturalWidth;;
      if (top >= 0) {
        e.target.style.top = '0px';
      }
      if (top <= (y1 - y2)) {
        e.target.style.top = (y1 - y2).toString() + 'px';
      }
      if (left >= 0) {
        e.target.style.left = '0px';
      };
      if (left <= (x1 - x2)) {
        e.target.style.left = (x1 - x2).toString() + 'px';
      }
    }
  }

  updateCover() {
    const companyDetails = {
      _id: this.postDetails._id,
      name: this.postDetails.name,
      cover: this.uploadedCoverUrl
    }
    this.companyService.updateCompany(companyDetails).subscribe(c => {
      this.postDetails = c;
      this.companyDetails$ = of(c);
      this.updateCover = null;
      this.uploadedCoverUrl = null;
    })
  }

}
