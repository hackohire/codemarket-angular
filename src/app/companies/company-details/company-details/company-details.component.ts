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

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
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

  commentForm: FormGroup;
  commentsList: any[];

  /** Q&A Related Variables */
  questionOrAnswerForm: FormGroup;
  questionsList: any[];
  answerData: [];
  questionData: [];

  commentId: string;

  challengesDescription = [];
  postDescriptionInstances = [];
  companyViewLinks = [
    {
      view: 'description',
      title: 'Home'
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
      view: 'comments',
      title: 'Comments'
    },
    {
      view: 'q&a',
      title: 'Q & A'
    },
    {
      view: 'creator',
      title: 'Creator'
    },
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
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.queryParams.type;
    this.commentId = this.activatedRoute.snapshot.queryParams['commentId'];

    console.log(this.activatedRoute.snapshot.queryParams);

    const params = this.activatedRoute.snapshot.params;


    this.subscription$.add(
      this.companyService.getCompanyById(params.companyId).subscribe({
        next: (c: Company) => {
          this.companyDetails$ = of(c);
          this.companyDetails = c;
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

  getDate(d: string) {
    return moment(d).isValid() ? d : new Date(+d);
  }


  addComment() {
    console.log(this.commentForm.value);
    if (this.authService.loggedInUser) {
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));

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

  addChallenge(type) {
    this.updateCompany({}, {field: 'challenges', operation: 'ADD', challenges: {challengeType: type, description: this.challengesDescription}});
  }

  deleteChallenge(_id: string) {
    this.updateCompany({}, {field: 'challenges', operation: 'DELETE', challenges: { _id }});
  }

  updateChallenge(_id: string) {
    this.updateCompany({}, {field: 'challenges', operation: 'UPDATE', challenges: { _id, description: this.postDescriptionInstances[_id] }});
  }

  updateCompany(companyDetails, updateOperation = null) { 
    companyDetails['_id'] = this.companyDetails._id;
    companyDetails['name'] = this.companyDetails.name;
    this.companyService.updateCompany(companyDetails, updateOperation).pipe(
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

}