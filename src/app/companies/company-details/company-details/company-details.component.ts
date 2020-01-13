import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../../shared/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShareService } from '@ngx-share/core';
import { PostService } from '../../../shared/services/post.service';
import { SweetalertService } from '../../../shared/services/sweetalert.service';
import { CompanyService } from '../../company.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable, Subscription, of } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { Company } from '../../../shared/models/company.model';
import { User } from '../../../shared/models/user.model';
import { environment } from '../../../../environments/environment';
import { BreadCumb } from '../../../shared/models/bredcumb.model';
import { FormGroup, FormControl } from '@angular/forms';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/internal/operators/map';
import { appConstants } from '../../../shared/constants/app_constants';
import Storage from '@aws-amplify/storage';
import moment from 'moment';
import { catchError } from 'rxjs/internal/operators/catchError';
import Swal from 'sweetalert2';
import { AddEventComponent } from '../../../event/add-event/add-event.component';
import { MatDialog } from '@angular/material/dialog';
import { Event } from '../../../shared/models/event.model';
import { concatMap } from 'rxjs/operators/concatMap';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
  providers: [CompanyService, CommentService]
})
export class CompanyDetailsComponent implements OnInit {

  @ViewChild('successfulRSVP', { static: false }) successfulRSVP: SwalComponent;

  /** Company Details Related Varibale */
  companyDetails$: Observable<Company>;
  usersInterestedInCompany: User[];
  companyView: string;
  @ViewChild('coverPic', { static: false }) coverPic;
  @ViewChild('cover', { static: false }) cover: ElementRef;
  selectedCoverPic: string = '';
  uploadedCoverUrl: string = '';



  companyDetails: Post | Company | any;
  isUserAttending: boolean; /** Only for the event */
  subscription$: Subscription = new Subscription();
  type: string; // product | help-request | interview | requirement | Testing | Howtodoc
  likeCount: number;
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;

  eventsList: Event[] = [];
  noPastEvent: boolean;
  noUpcomingEvents: boolean;

  commentForm: FormGroup;
  commentsList: any[];

  /** Q&A Related Variables */
  questionOrAnswerForm: FormGroup;
  questionsList: any[];
  answerData: [];
  questionData: [];

  commentId: string;

  postDescription = [];
  postDescriptionInstances = [];
  commentDescriptionInstances = [];
  companyViewLinks = [
    {
      view: 'home',
      title: 'Home'
    },
    {
      view: 'mission',
      title: 'Mission'
    },
    {
      view: 'goals',
      title: 'Goals'
    },
    {
      view: 'sales-challenges',
      title: 'Sales Challenges'
    },
    {
      view: 'team-challenges',
      title: 'Team Challenges'
    },
    {
      view: 'business-challenges',
      title: 'Business Challenges'
    },
    {
      view: 'marketing-challenges',
      title: 'Marketing Challenges'
    },
    {
      view: 'technical-challenges',
      title: 'Technical Challenges'
    },
    {
      view: 'events',
      title: 'Events'
    },
    {
      view: 'q&a',
      title: 'Q & A'
    },
    // {
    //   view: 'creator',
    //   title: 'Creator'
    // },
    {
      view: 'interested-people',
      title: 'Interested Professionals'
    },
    {
      view: 'info',
      title: 'Info'
    },
  ]

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
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.queryParams.type;
    this.commentId = this.activatedRoute.snapshot.queryParams['commentId'];
    const companyPostId = this.activatedRoute.snapshot.queryParams['companyPostId'];

    const params = this.activatedRoute.snapshot.params;


    this.subscription$.add(
      this.companyService.getCompanyById(params.companyId)
        .pipe(
          concatMap((company, index) => {
            return index === 0 ?
              of(company).pipe(
                tap(() => {
                  if (this.commentId && companyPostId && company && company.posts && company.posts.length) {
                    const post = company.posts.find(p => p._id === companyPostId);
                    const comment = post.comments.find(c => c._id === this.commentId);
                    switch (post.postType) {
                      case 'mission':
                        this.companyView = 'mission';
                        break;
                      case 'goal':
                        this.companyView = 'goals';
                        break;
                      case 'post':
                        this.companyView = 'home';
                        break;
                      case 'challenge':
                        this.companyView = post.challengeType + '-challenges';
                        break;
                      default:
                        this.companyView = 'home'
                    }
                    this.commentService.scrollToComment(post.description, comment);

                    /** Get the list of users in a company */
                    this.subscription$.add(
                      this.companyService.getListOfUsersInACompany(params.companyId).subscribe((u) => {
                        // console.log(u);
                        if (u) {
                          this.usersInterestedInCompany = u;
                        }
                      })
                    );

                    /** Fetch the list of events related to the company */
                    this.subscription$.add(
                      this.companyService.getEventsByCompanyId(params.companyId).subscribe(e => {
                        if (e && e.length) {
                          this.eventsList = e;
                        }
                      })
                    );
                  }
                })
              ) : of(company)
          })
        )
        .subscribe({
          next: (c: Company) => {
            if (c && c._id) {
              this.companyDetails$ = of(c);
              this.companyDetails = c;
              this.initializeCommentForm(c, 'company');
              this.initializeQuestionAndAnswerForm(c, 'company');
            }
          }
        })
    );

    this.subscription$.add(
      this.activatedRoute.queryParams.subscribe((q) => {
        if (q && q.view) {
          this.companyView = q.view;
        } else {
          // this.router.navigate(['./'], { queryParams: { view: 'home' }, queryParamsHandling: 'merge', relativeTo: this.activatedRoute });
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

    // this.commentService.getCommentsByReferenceId(p, this.commentId);

  }

  addComment(postId = '') {
    console.log(this.commentForm.value);
    if (this.authService.loggedInUser) {
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentForm.addControl('postId', new FormControl(postId))
      this.subscription$.add(
        this.commentService.addComment(this.commentForm.value).subscribe()
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

  addPost(postType: string, challengeType = '') {
    if (this.authService.loggedInUser) {
      this.updateCompany({}, { operation: 'ADD', post: { challengeType, postType, createdBy: this.authService.loggedInUser._id, description: this.postDescription } });
    } else {
      this.authService.checkIfUserIsLoggedIn(true)
    }
  }

  deletePost(_id: string) {
    this.updateCompany({}, { operation: 'DELETE', post: { _id } });
  }

  updatePost(_id: string) {
    this.updateCompany({}, { operation: 'UPDATE', post: { _id, description: this.postDescriptionInstances[_id] } });
  }

  updateCompany(companyDetails, operation = null) {
    companyDetails['_id'] = this.companyDetails._id;
    // companyDetails['name'] = this.companyDetails.name;
    this.companyService.updateCompany(companyDetails, operation).pipe(
      catchError((e) => {
        Swal.fire('Name already exists!', '', 'error');
        return of(false);
      })
    )
      .subscribe((d: any) => {
        if (d) {
          // Swal.fire(`${d.name} has been Updated Successfully`, '', 'success');
        }
      });
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

  updateCover() {
    const companyDetails = {
      _id: this.companyDetails._id,
      name: this.companyDetails.name,
      cover: this.uploadedCoverUrl
    }
    this.companyService.updateCompany(companyDetails).subscribe(c => {
      this.companyDetails = c;
      this.companyDetails$ = of(c);
      this.updateCover = null;
      this.uploadedCoverUrl = null;
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddEventComponent, {
      width: '600px',
      // height: '550px',
      // maxHeight: '700px',
      panelClass: ['no-padding'],
      data: { company: this.companyDetails },
      // disableClose: true,
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.eventsList.push(result);
      // this.animal = result;
    });
  }

  getDate(d: string) {
    return moment(d).isValid() ? moment(d) : moment(new Date(+d));
  }

  filterEventsBasedOnDate(past: boolean) {
    const eventsList = this.eventsList.filter((e) => this.isPast(e.dateRange[1] ? e.dateRange[1] : e.dateRange[0]) === past);
    this.noPastEvent = past ? !Boolean(eventsList.length) : this.noPastEvent;
    this.noUpcomingEvents = !past ? !Boolean(eventsList.length) : this.noUpcomingEvents;
    return eventsList
  }
  isPast(d): boolean {
    return this.getDate(d).isBefore(moment());
  }

}
