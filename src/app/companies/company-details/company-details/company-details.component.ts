import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentService } from '../../../shared/services/comment.service';
import { AuthService } from '../../../core/services/auth.service';
import { ShareService } from '@ngx-share/core';
import { PostService } from '../../../shared/services/post.service';
import { SweetalertService } from '../../../shared/services/sweetalert.service';
import { CompanyService } from '../../company.service';
import { Subscription, of, Observable } from 'rxjs';
import { keyBy, orderBy } from 'lodash';
import { Post } from '../../../shared/models/post.model';
import { Company } from '../../../shared/models/company.model';
import { User } from '../../../shared/models/user.model';
import { environment } from '../../../../environments/environment';
import { BreadCumb } from '../../../shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/internal/operators/map';
import { appConstants } from '../../../shared/constants/app_constants';
import Storage from '@aws-amplify/storage';
import moment from 'moment';
import { concatMap } from 'rxjs/operators/concatMap';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { EditorComponent } from '../../../shared/components/editor/editor.component';
import { MdePopoverTrigger } from '@material-extended/mde';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { EmailService } from 'src/app/email/email.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'reply-dialog',
  templateUrl: 'reply-dialog.html',
})
export class ReplyDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ReplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onOkClick() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'],
  providers: [CompanyService, CommentService],
  animations: [
    trigger('bodyExpansion', [
      state('collapsed', style({ height: '0px', display: 'none' })),
      state('expanded', style({ height: '*', display: 'block' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
  ],
})

export class CompanyDetailsComponent implements OnInit, OnDestroy {

  usersInterestedInCompany: User[];
  companyView: string;
  totalCampaign: number;
  companyId: string;
  customTabs = [
    {
      name: 'campaigns',
      label: 'Campaigns',
      isCustom: true
    }
  ];

  campaignsList = [];

  postTypesArray = appConstants.postTypesArray;

  @ViewChild('coverPic', { static: false }) coverPic;
  @ViewChild('cover', { static: false }) cover: ElementRef;
  selectedCoverPic: File;
  selectedCoverPicURL = '';
  uploadedCoverUrl = '';

  hideTabs = false;
  batchId = '';
  contactList: any[];
  totalContactCount = 0;

  companyDetails: Post | Company | any;
  isUserAttending: boolean; /** Only for the event */
  subscription$: Subscription = new Subscription();
  type: string; // product | help-request | interview | requirement | Testing | Howtodoc
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;

  commentForm: FormGroup;
  commentsList: any[];

  companyRelatedPosts: { posts: Post[], total?: number } = { posts: [] };
  totalcompanyRelatedPosts: number;
  paginator: MatPaginator;

  selectedBlock = null;

  selectedPost: Post;
  selectedPostComments: Observable<Comment[]>;

  /** Q&A Related Variables */
  questionOrAnswerForm: FormGroup;
  questionsList: any[];
  answerData: [];
  questionData: [];

  commentId: string;
  mailingList: any[];

  emailAsc = true;
  nameAsc = true;
  phoneAsc = true;
  firstNameAsc = true;
  lastNameAsc = true;
  companyNameAsc = true;
  statusAsc = true;

  currentOrderValue = 'name';
  currentOrder = '-1';

  emailCount = 0;
  phoneCount = 0;

  postDescription: [{
    type: string;
    data: any
  }];

  sendEmailForm: FormGroup;
  saveEmailForm: FormGroup;
  trackEmailForm: FormGroup;
  displayCampaignList = false;
  file;
  onlySaveFile;

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;

  @ViewChild(MdePopoverTrigger, { static: false }) socialMediaPopover: MdePopoverTrigger;

  companyViewLinks = [
    {
      view: 'home',
      title: 'Home'
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
    {
      view: 'posts',
      title: 'Posts'
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    public commentService: CommentService,
    public authService: AuthService,
    public share: ShareService,
    public postService: PostService,
    private router: Router,
    private sweetAlertService: SweetalertService,
    public companyService: CompanyService,
    public auth: AuthService,
    private emailService: EmailService,
    private changeDetector: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.queryParams.type;
    this.commentId = this.activatedRoute.snapshot.queryParams['commentId'];

    this.companyId = this.activatedRoute.snapshot.queryParams.id;

    const params = this.activatedRoute.snapshot.params;

    this.companyView = this.activatedRoute.snapshot.queryParams['view'] ? this.activatedRoute.snapshot.queryParams['view'] : 'posts';

    this.initializeEmailForms();

    this.subscription$.add(
      this.companyService.getCompanyById(params.slug)
        .pipe(
          concatMap((company, index) => {
            return index === 0 ?
              of(company).pipe(
                tap(() => {
                  /** Get the list of users in a company */
                  // this.subscription$.add(
                  //   this.companyService.getListOfUsersInACompany(params.companyId).subscribe((u) => {
                  //     // console.log(u);
                  //     if (u) {
                  //       this.usersInterestedInCompany = u;
                  //     }
                  //   })
                  // );
                })
              ) : of(company);
          })
        )
        .subscribe({
          next: (c: Company) => {
            if (c && c._id) {
              this.companyDetails = c;
              this.initializeCommentForm(c, 'post');
              this.initializeQuestionAndAnswerForm(c, 'company');

              this.selectMainCategory({ name: this.companyView });
              if (this.companyId) {
                this.postService.getCountOfAllPost('', this.companyId, '').subscribe((data) => {
                  if (data.length) {
                    data = keyBy(data, '_id');
                    appConstants.postTypesArray.forEach((obj) => {
                      obj['count'] = data[obj.name] ? data[obj.name].count : 0
                    });
                  }
                });
                this.emailService.getMailingList(this.companyId).subscribe((res) => {
                  console.log("This is MailingList ==> ", res);
                  this.mailingList = res;
                });
              }
            }
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

  initializeEmailForms() {
    this.saveEmailForm = new FormGroup({
      csvfile: new FormControl('', Validators.required),
      label: new FormControl('', Validators.required),
      companies: new FormControl('', Validators.required),
    });

    this.trackEmailForm = new FormGroup({
      batches: new FormControl('', Validators.required),
      companies: new FormControl('', Validators.required),
    });

    this.sendEmailForm = new FormGroup({
      batches: new FormControl('', Validators.required),
      companies: new FormControl('', Validators.required),
      emailTemplate: new FormControl(''),
      subject: new FormControl('', Validators.required),
      from: new FormControl('', Validators.required)
    })
  }

  initializeCommentForm(p, commentType?: string) {
    this.commentForm = new FormGroup({
      referenceId: new FormControl(),
      companyReferenceId: new FormControl(p._id),
      type: new FormControl(commentType ? commentType : this.type),
    });

    // this.commentService.getCommentsByReferenceId(p, this.commentId);

  }

  isExpanded(category) {
    if (category && category.types) {
      return category.types.indexOf(c => c.view === this.companyView) > 0;
    }
    return false;
  }

  async addComment(postId = '', commentEditor: EditorComponent) {
    console.log(this.commentForm.value);
    if (this.authService.loggedInUser) {
      this.commentForm.addControl('createdBy', new FormControl(this.authService.loggedInUser._id));
      this.commentForm.patchValue({ referenceId: postId });
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

  edit(details) {
    if (this.type === 'company') {
      this.companyService.editCompany(details);
    } else {
      this.postService.editPost(details);
    }
  }


  /** Initializing Question & Answer Form */
  initializeQuestionAndAnswerForm(p, questionType?: string) {
    // this.questionOrAnswerForm = new FormGroup({
    //   text: new FormControl(''),
    //   referenceId: new FormControl(p._id),
    //   type: new FormControl(questionType ? questionType : this.type),
    //   isQuestion: new FormControl(),
    //   isAnswer: new FormControl()
    // });

    // this.subscription$.add(
    //   this.commentService.getQuestionAndAnswersByReferenceId(p._id).pipe(
    //     tap((d) => {
    //       this.questionsList = d;
    //     })
    //   ).subscribe({
    //     error: (e) => console.log(e)
    //   })
    // );
  }

  /** Add Question Or Answer */
  async addQuestionOrAnswer(isQuestion, question = null, questionAnswerEditor: EditorComponent) {
    console.log(this.questionOrAnswerForm.value);
    if (this.authService.loggedInUser) {
      const blocks = await questionAnswerEditor.editor.save();
      this.questionOrAnswerForm.get('text').setValue(blocks.blocks);

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
                question.answers.push(d);
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
  async updateQuestionOrAnswer(qa, isAnswer, questionAnswerEditor: EditorComponent) {
    const blocks = await questionAnswerEditor.editor.save();
    this.commentService.updateQuestionOrAnswer(qa._id, blocks.blocks).pipe(
      tap((d) => {
        console.log(d);
        if (d) {
          qa['edit'] = false;
          qa.text = d.text;
        }
      })
    ).subscribe();
  }

  deletePost(_id: string) {
    this.postService.deletePost(_id, { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser.name }).subscribe();
  }

  updateCompany(companyDetails) {
    companyDetails['_id'] = this.companyDetails._id;
    // companyDetails['name'] = this.companyDetails.name;
    this.companyService.updateCompany(companyDetails).pipe()
      .subscribe();
  }

  /** Send and save email functions */
  uploadFile(event, action) {
    if (action === 'save') {
      this.onlySaveFile = event.target.files[0];
      console.log(this.onlySaveFile);
      if (this.onlySaveFile.name.split(".")[1] !== 'csv') {
        Swal.fire(`Invalid File Type`, '', 'error').then(() => {
          this.saveEmailForm.get('csvfile').setValue('');
          this.file = '';
        });
      }
    } else {
      this.file = event.target.files[0];
      console.log(this.file);
      if (this.file.name.split(".")[1] !== 'csv') {
        Swal.fire(`Invalid File Type`, '', 'error').then(() => {
          this.saveEmailForm.get('csvfile').setValue('');
          this.file = '';
        });
      }
    }
  }

  csvToJSON(csv, action, callback) {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j <= headers.length; j++) {
        obj[headers[j]] = currentline[j];
        if (action === 'saveClean') {
          obj['email'] = JSON.parse(currentline[headers.indexOf('email')])
        }
      }
      result.push(obj);
    }
    if (callback && (typeof callback === 'function')) {
      return callback(result);
    }
    return result;
  }

  saveFile() {
    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      // console.log(fileReader.result);
      this.csvToJSON(fileReader.result, 'save', (result) => {
        console.log("This is result", result);
        this.emailService.saveCsvFileData(result, this.authService.loggedInUser._id, this.onlySaveFile.name, this.saveEmailForm.value.label, this.saveEmailForm.value.companies).subscribe((data) => {
          console.log("Response of the file read ==> ", data);
          this.mailingList.push({name: this.saveEmailForm.value.label});
          Swal.fire('Contacts have been saved successfully.', '', 'success');
        }, (err) => {
          Swal.fire('Error while saving emails into the database.', '', 'error');
        });
      })
    }
    fileReader.readAsText(this.onlySaveFile);
  }

  async submit() {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    this.changeDetector.detectChanges();

    this.sendEmailForm.get('emailTemplate').setValue(this.descriptionEditor.html);

    console.log(this.sendEmailForm.value);
    this.emailService.getEmailData(this.sendEmailForm.value.batches, this.sendEmailForm.value.emailTemplate, this.sendEmailForm.value.subject, this.authService.loggedInUser._id, this.sendEmailForm.value.from, this.sendEmailForm.value.companies).subscribe((data) => {
      console.log("Response of the email Data ==> ", data);
      Swal.fire('Emails have been sent successfully.', '', 'success');
    }, (err) => {
      Swal.fire(`Invalid Data`, '', 'error').then(() => {
      });
    });
  }

  getCampaignData() {
    console.log('EMail Data is called')
    const paginationObj = {
      pageNumber: 1, limit: 10,
      sort: { order: '' }
    };

    this.companyService.getCampaignsWithTracking(paginationObj, this.trackEmailForm.value.companies._id, this.trackEmailForm.value.batches._id).subscribe(c => {
      if (c && c.length) {
        this.displayCampaignList = true;
        // this.fetchEmailsConnectedWithCampaign();
        this.campaignsList = c;
      }
    })
  }

  fetchEmailsOfCampaign() {
    console.log('fetchEmailsConnectedWithCampaign Data is called')

    const paginationObj = {
      pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      sort: { order: '' }
    };

    this.companyService.getCampaignsWithTracking(paginationObj, this.trackEmailForm.value.companies._id, this.trackEmailForm.value.batches._id).subscribe(c => {
      if (c && c.length) {
        this.campaignsList = c;
      }
    })
  }

  openDialog(repliedHTML, fromEmail) {
    this.dialog.open(ReplyDialogComponent, {
      data: {
        repliedHTML: repliedHTML,
        fromEmail: fromEmail
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
      ).subscribe();
    });
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

        bucket: environment.fileS3Bucket,
        path: 'cover',
        level: 'public',
        contentType: this.selectedCoverPic.type,
      }).then((uploaded: any) => {
        console.log('uploaded', uploaded);
        this.uploadedCoverUrl = uploaded.key;
      });
    }

    const companyDetails = {
      _id: this.companyDetails._id,
      name: this.companyDetails.name,
      cover: this.uploadedCoverUrl
    }
    this.companyService.updateCompany(companyDetails).subscribe(c => {
      this.companyDetails = c;
      this.selectedCoverPic = null;
      this.selectedCoverPicURL = '';
      this.uploadedCoverUrl = '';
    });
  }

  removeCover(userId: string) {
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

  selectMainCategory(category) {
    if (!category.custom) {
      this.companyView = category.name;
      this.router.navigate(['./'], { relativeTo: this.activatedRoute, queryParams: { view: category.name }, queryParamsHandling: 'merge' });
    }

    // if (category.name === 'campaigns') {
    //   const paginationObj = {
    //     pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
    //     sort: {order: ''}};

    //   this.subscription$.add(
    //     this.companyService.getCampaignsWithTracking(paginationObj, this.companyDetails._id).subscribe(c => {
    //       if (c && c.length) {
    //         this.campaignsList = c;
    //       }
    //     })
    //   );
    // }

    switch (category.name) {
      case 'campaigns':
        const paginationObj = {
          pageNumber: 1, limit: 10,
          sort: { order: '' }
        };

        this.subscription$.add(
          this.companyService.getCampaignsWithTracking(paginationObj, this.companyDetails._id).subscribe(c => {
            if (c && c.length) {
              this.campaignsList = c;
            }
          })
        );
        break;
    }
  }

  /** Update Social Media Links and clos the popover after successful update */
  updateSocialMedia(fb, twitter, linkedin, instagram, yelp, website) {
    const companyData: Company = {
      _id: this.companyDetails._id,
      name: this.companyDetails.name,
      facebookLink: fb,
      twitterLink: twitter,
      linkedinLink: linkedin,
      instagramLink: instagram,
      yelpLink: yelp,
      websiteLink: website,
    };
    this.companyService.updateCompany(companyData).pipe()
      .subscribe(c => {
        if (c) {
          this.companyDetails = c;
          this.socialMediaPopover.closePopover();
        }
      });
  }

  showCommentsOnSide(event: { block: any, comments, selectedPost }) {
    console.log(event);
    this.selectedBlock = event.block;
    this.selectedPostComments = event.comments;
    this.selectedPost = event.selectedPost;
  }

  /** Fetch the list of posts connected with company based on the pagination */
  fetchAllCompanyRealtedePosts(postType = '') {
    const paginationObj = {
      pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      sort: { order: '' }
    };

    if (postType === 'contact') {
      if (this.currentOrderValue) {
        paginationObj.sort.order = this.currentOrder;
        paginationObj.sort['field'] = this.currentOrderValue;
      }
    }

    this.postService.getAllPosts(
      paginationObj, postType, '', this.companyDetails._id).subscribe((u) => {
        this.companyRelatedPosts.posts = u.posts;
        this.totalcompanyRelatedPosts = u.total;
        if (postType === 'contact') {
          this.postService.getEmailPhoneCountForContact(postType).subscribe((b) => {
            this.emailCount = b[0].emailCount ? b[0].emailCount : 0;
            this.phoneCount = b[0].phoneCount ? b[0].phoneCount : 0;
          })
        }

      });
  }

  /** Fetch the list of posts connected with company based on the pagination */
  fetchEmailsConnectedWithCampaign(campaignId, campaignIndex) {
    const paginationObj = {
      pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      sort: { order: '' }
    };

    // this.companyService.getCampaignsWithTracking(paginationObj, this.companyDetails._id).subscribe(c => {
    //   if (c && c.length) {
    //     this.campaignsList = c;
    //   }
    // })
    this.companyService.getCampaignEmails(paginationObj, campaignId).subscribe(c => {
      if (c && c.emails && c.emails.length) {
        this.campaignsList[campaignIndex].emailData = c.emails;
      }
    });
  }

  redirectToAddPost(postType) {
    this.router.navigate(['./post/add-post'], { state: { post: { companies: [{ name: this.companyDetails.name, _id: this.companyDetails._id }] } }, queryParams: { type: postType } });
  }

  changeOrder(value, order, postType) {

    const paginationObj = {
      pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      sort: { order: '' }
    };

    paginationObj.sort['field'] = value;
    paginationObj.sort['order'] = order === 'asc' ? '1' : '-1';
    this.currentOrderValue = value;
    this.currentOrder = order === 'asc' ? '1' : '-1';

    this.emailService.getMailingListContacts(
      paginationObj, this.batchId).subscribe((u) => {
        this.contactList = u.contacts;
        this.totalContactCount = u.total;
        if (order === 'asc') {
          switch (value) {
            case 'email':
              this.emailAsc = false;
              break;
            case 'phone':
              this.phoneAsc = false;
              break;
            case 'name':
              this.nameAsc = false;
              break;
            case 'firstName':
              this.firstNameAsc = false;
              break;
            case 'lastName':
              this.lastNameAsc = false;
              break;
            case 'companyName':
              this.companyNameAsc = false;
              break;
            case 'status':
              this.statusAsc = false;
              break;

            default:
              break;
          }
        }
        if (order === 'desc') {
          switch (value) {
            case 'email':
              this.emailAsc = true;
              break;
            case 'phone':
              this.phoneAsc = true;
              break;
            case 'name':
              this.nameAsc = true;
              break;
            case 'firstName':
              this.firstNameAsc = true;
              break;
            case 'lastName':
              this.lastNameAsc = true;
              break;
            case 'companyName':
              this.companyNameAsc = true;
              break;
            case 'status':
              this.statusAsc = true;
              break;
            default:
              break;
          }
        }

      });

    // this.companyRelatedPosts.posts = orderBy(this.games, [value], order);
  }

  // Get Contacts of Particular Mailing List
  reDirectToMailingList(batchId) {
    console.log(batchId);
    this.companyView = 'contact1';
    this.hideTabs = true;
    this.batchId = batchId;
    const paginationObj = {
      pageNumber: 1, limit: 10,
      sort: { order: '' }
    };

    this.emailService.getMailingListContacts(paginationObj, batchId).subscribe((res) => {
      this.contactList = res.contacts;
      this.totalContactCount = res.total;
    });

  }

  fetchContactsRelatedtoMailingList() {
    const paginationObj = {
      pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
      sort: {order: ''}};
   
      this.emailService.getMailingListContacts(paginationObj, this.batchId).subscribe((res) => {
          this.contactList = res.contacts;
          this.totalContactCount = res.total;
      })
  }
}
