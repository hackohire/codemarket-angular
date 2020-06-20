import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { AppState } from 'src/app/core/store/state/app.state';
import { Store } from '@ngrx/store';
import { tap, map, share } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl } from '@angular/forms';
import moment from 'moment';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommentService } from 'src/app/shared/services/comment.service';
import { environment } from 'src/environments/environment';
import { selectSelectedPost } from 'src/app/core/store/selectors/post.selectors';
import { Post } from 'src/app/shared/models/post.model';
import { MatDialog, MatPaginator } from '@angular/material';
import { VideoChatComponent } from 'src/app/video-chat/video-chat.component';
import { PostService } from '../../shared/services/post.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { appConstants } from '../../shared/constants/app_constants';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ShareService } from '@ngx-share/core';
import { set, sumBy } from 'lodash';
import { get } from 'lodash';
import { PostType } from '../../shared/models/post-types.enum';
import { FormBuilderService } from 'src/app/form-builder/form-builder.service';
import Swal from 'sweetalert2';
import { AppointmentService } from '../../shared/services/appointment.service';
import { isNullOrUndefined } from 'util';
import { BookingComponent } from '../../shared/components/booking/booking.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [CommentService]
})
export class DetailsComponent implements OnInit, OnDestroy {

  // HIDE SHOW SIDEBAR
  public show = true;
  public buttonName: any = 'Hide';

  @ViewChild('successfulRSVP', { static: false }) successfulRSVP: SwalComponent;
  details$: Observable<Post>;

  postTypeEnum = PostType;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  postTypesArray = appConstants.postTypesArray;

  postDetails: Post;
  subscription$: Subscription = new Subscription();
  type: string; // product | help-request | interview | requirement | Testing | Howtodoc
  anonymousAvatar = '../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;

  commentForm: FormGroup;
  postForm: FormGroup;
  commentsList: any[];
  collaborators: string[];
  // peer: Peer;

  commentId: string;
  blockId: string;

  listOfConnectedPosts: { posts: Post[], total?: number } = { posts: [] };
  totalOtherPosts: number;
  paginator: MatPaginator;

  showConnectedPosts = false;
  selectedPostType = '';

  selectedBlock = null;

  selectedPost: Post;
  selectedPostComments: Observable<Comment[]>;

  displayChatBox = false;

  selectedPostTypeDetails = null;
  // Survey Form variables
  totalPoints = 0;
  public form1 = { components: [] };
  formDataJsonToSave = [];
  currentFormIndex = 0;
  lastFormIndex = -1;

  individualPoints = [];
  formArray = [];
  enableSubmitButton = false;

  hideAllButton = false;

  constructor(
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    public commentService: CommentService,
    public authService: AuthService,
    private dialog: MatDialog,
    public postService: PostService,
    private router: Router,
    public shareSocial: ShareService,
    private breakpointObserver: BreakpointObserver,
    private formBuilderService: FormBuilderService,
    public appointmentService: AppointmentService
  ) {
    /** Peer Subscription for Video Call */
    // this.userService.peer.subscribe((p) => {
    //   if (p) {
    //     console.log(p);
    //     this.peer = p;
    //   }
    // });
  }

  ngOnInit() {
    /** Read the type of the post  */
    this.type = this.activatedRoute.snapshot.queryParams.type;

    this.commentId = this.activatedRoute.snapshot.queryParams.commentId;
    this.blockId = this.activatedRoute.snapshot.queryParams.blockId;

    console.log(this.activatedRoute.snapshot.queryParams);

    const params = this.activatedRoute.snapshot.params;

    const postId = params && params.slug ? params.slug.split('-').pop() : '';

    this.authService.selectedPostId = postId;

    this.subscription$.add(this.store.select(selectSelectedPost).pipe(
      tap((p: Post) => {
        if (p) {
          this.postDetails = p;
          if (this.postDetails.formStructureJSON) {
            this.createIndividualForm(this.postDetails.formStructureJSON);
          }

          this.collaborators = this.postDetails.collaborators.map((cDetail) => {
            return cDetail._id;
          });
          this.details$ = of(p);
          this.initializeCommentForm(p, 'post');
          this.selectedPostTypeDetails = appConstants.postTypesArray.find((pType) => p.type === pType.name);
          this.postFormInitialization(p);

          this.breadcumb = {
            path: [
              {
                name: p.type,
                pathString: '/'
              }
            ]
          };

          this.checkIfVideoChat();

          this.subscription$.add(
            this.authService.loggedInUser$.subscribe((u) => {
              if (u) {
                this.checkIfVideoChat();
              }
            })
          );


          // this.postService.getCountOfAllPost('', '',
          //   {
          //     referencePostId: [this.postDetails._id],
          //     connectedPosts: this.postDetails.connectedPosts.map(p => p._id),
          //     postType: null
          //   }).subscribe((data) => {
          //     if (data.length) {
          //       data = keyBy(data, '_id');
          //       appConstants.postTypesArray.forEach((obj) => {
          //         obj['count'] = data[obj.name] ? data[obj.name].count : 0
          //       });
          //     }
          //   });

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

  postFormInitialization(i: Post) {
    this.postForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : ''),
      price: new FormControl(i && !isNullOrUndefined(i.price) ? i.price : null),
      tags: new FormControl(i && i.tags ? i.tags : []),
      companies: new FormControl(i && i.companies ? i.companies : []),
      clients: new FormControl(i && i.clients ? i.clients : []),
      collaborators: new FormControl(i && i.collaborators ? i.collaborators : []),
    });

    /** Add FormControls(Fields) specific to the post types */
    switch (i.type) {

      case PostType.Appointment:
        this.postForm.addControl('cancelReason', new FormControl(i && i.cancelReason ? i.cancelReason : ''));
        break;

      case PostType.Mentor:
        this.postForm.addControl('mentor', new FormGroup({
          topics: new FormControl(i && i.mentor && i.mentor.topics ? i.mentor.topics : []),
          availabilityDate: new FormControl(i && i.mentor && i.mentor.availabilityDate ? i.mentor.availabilityDate : [])
        }));
        break;

      case PostType.Job:
        this.postForm.addControl('job', new FormGroup({
          jobProfile: new FormControl(i && i.job && i.job.jobProfile ? i.job.jobProfile : [])
        }));
        break;
    }

  }

  initializeCommentForm(p, commentType?: string) {
    this.commentForm = new FormGroup({
      text: new FormControl(''),
      referenceId: new FormControl(p._id),
      type: new FormControl(commentType ? commentType : this.type),
    });

    this.commentService.getCommentsByReferenceId(p, this.commentId);

    if (this.blockId) {
      this.selectedBlock = this.postDetails.description.find((b: any) => b._id === this.blockId);
      console.log(this.selectedBlock);
    }

  }

  getDate(d: string) {
    return moment(d).isValid() ? d : new Date(+d);
  }

  fromNow(date) {
    const d = moment(date).isValid() ? date : new Date(+date);
    return moment(d).fromNow();
  }

  edit(details) {
    this.postService.editPost(details);
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  redirectToAddPost(p, postType) {
    this.router.navigate(['../add-post'], { relativeTo: this.activatedRoute, state: { post: p }, queryParams: { type: postType } });
  }

  showCommentsOnSide(event: { block: any, comments, selectedPost }) {
    console.log(event);
    this.selectedBlock = event.block;
    this.selectedPostComments = event.comments;
    this.selectedPost = event.selectedPost;
  }

  getConnectedPosts(postType) {
    this.showConnectedPosts = true;

    if (this.paginator) {
      const paginationObj = {
        pageNumber: this.paginator.pageIndex + 1, limit: this.paginator.pageSize ? this.paginator.pageSize : 10,
        sort: { order: '' }
      };

      this.postService.getAllPosts(
        paginationObj, this.selectedPostTypeDetails.name,
        null
      ).subscribe((u) => {
        this.listOfConnectedPosts.posts = u.posts;
        this.totalOtherPosts = u.total;
      });
    }
  }

  onChatClicked() {
    this.displayChatBox = true;
  }

  allowUsersEdit = () => {
    const loggedInUser = this.authService.loggedInUser;
    return loggedInUser && loggedInUser._id && this.postDetails && this.postDetails._id && (loggedInUser._id === this.postDetails.createdBy._id || this.postDetails.collaborators.find(c => c._id === loggedInUser._id));
  }

  addDataOfPost(data, popover) {
    const postObj = {
      _id: this.postDetails._id,
    };

    set(postObj, data, this.postForm.get(data).value);

    this.postService.updatePost(
      postObj,
      { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id }
    ).subscribe((j) => {
      if (j && get(j, data)) {
        set(this.postDetails, data, get(j, data));
        popover._emitCloseEvent();
      }
    });
  }

  checkIfVideoChat() {
    if (this.activatedRoute.snapshot.queryParams.video_chat) {
      if (!this.authService.loggedInUser) {
        this.authService.checkIfUserIsLoggedIn(true);
        return;
      }
      this.openVideoRoom();
    }
  }

  openVideoRoom(): void {
    this.dialog.open(VideoChatComponent, {
      minWidth: '100vw',
      height: '100vh',
      data: { post: this.postDetails, loggedInUser: this.authService.loggedInUser },
      disableClose: true
    });
  }

  onSubmitSurveyForm(event) {
    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    const exclude = ['selected'];


    const result = this.formDataJsonToSave.reduce((acc, curr) => {
      Object.entries(curr).forEach(([k, v]) => {
        if (!exclude.includes(k)) { acc[`${k}`] = v; }
      });
      return acc;
    }, {});


    const formObjToSave = {
      formname: this.postDetails.name,
      formDataJson: result,
      connectedFormStructureId: this.postDetails._id,
      createdBy: this.authService.loggedInUser._id
    };

    console.log('Form Data save Obj ==> ', formObjToSave);

    this.formBuilderService.addformData(formObjToSave).subscribe((d: any) => {
      if (d) {
        Swal.fire(`Your data for ${formObjToSave.formname} has been Added Successfully`, '', 'success').then(() => {
          this.router.navigate(['/dashboard']);
        });
      }
    });
  }

  valueChangeFun(event) {
    if (event.data) {
      const values: any = Object.values(event.data);
      this.totalPoints = 0;
      // values.forEach((i: any) => {
      //   if (parseInt(i)) {
      //     this.totalPoints += i;
      //   }
      // });

      this.formArray[this.currentFormIndex].value = values[0] !== '' ? values[0] : 0;
      this.totalPoints = sumBy(this.formArray, 'value') || 0;
      this.formDataJsonToSave[this.currentFormIndex][this.formArray[this.currentFormIndex].form1.components[0].key] = values[0] || 0;
      this.formDataJsonToSave[this.currentFormIndex].selected = values[0] !== '' ? true : false;
      const allSelected = this.formDataJsonToSave.map((d) => {
        return d.selected;
      });

      if (allSelected.indexOf(false) === -1) {
        this.enableSubmitButton = true;
      } else {
        this.enableSubmitButton = false;
      }

    }
  }

  createIndividualForm(formStructureJSON: any) {
    formStructureJSON.components.forEach((c, i) => {
      if (i < formStructureJSON.components.length - 1) {
        this.formArray.push({
          form1: {
            components: [c],
            value: this.totalPoints
          }
        });

        this.formDataJsonToSave.push({
          [c.key]: 0,
          selected: false
        });
      }
    });

    this.form1 = this.formArray[this.currentFormIndex].form1;
  }


  onNextClick() {
    this.currentFormIndex += 1;
    this.lastFormIndex += 1;
    if (this.currentFormIndex < this.formArray.length) {
      this.form1 = this.formArray[this.currentFormIndex].form1;
    }
  }

  onBackClick() {
    this.formArray[this.currentFormIndex].value = 0;
    this.formDataJsonToSave[this.currentFormIndex][this.formArray[this.currentFormIndex].form1.components[0].key] = 0;
    this.currentFormIndex -= 1;
    this.lastFormIndex -= 1;
    this.form1 = this.formArray[this.currentFormIndex].form1;
  }

  setPrice(event) {
    this.postForm.get('price').setValue((+event.target.value).toFixed(2));
  }

  bookSession(status, popover) {

    // const post = {
    //   _id: this.postDetails._id,
    //   mentor: {
    //     status
    //   },
    //   createdBy: this.postDetails.createdBy._id,
    //   name: this.postDetails.name,
    //   slug: this.postDetails.slug
    // };
    // this.appointmentService.bookSession(post, this.authService.loggedInUser._id).subscribe(u => {
    //   console.log(u);
    // });
  }

  openBooking() {
    this.dialog.open(BookingComponent, {
      // minWidth: '100vw',
      // height: '100vh',
      data: { post: this.postDetails, loggedInUser: this.authService.loggedInUser },
      disableClose: true
    });
  }

  toggleDisplay() {
    this.show = !this.show;
    // CHANGE THE NAME OF THE BUTTON.
    if (this.show) {
      this.buttonName = 'Hide';
    } else {
      this.buttonName = 'Show';
    }

  }
}
