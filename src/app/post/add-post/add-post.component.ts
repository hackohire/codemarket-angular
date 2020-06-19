import { Component, OnInit, ViewChild, Input, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import moment from 'moment';
import { AuthService } from '../../core/services/auth.service';
import { AddPost, UpdatePost } from '../../core/store/actions/post.actions';
import { AppState } from '../../core/store/state/app.state';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { Post } from '../../shared/models/post.model';
import { Location, isPlatformBrowser } from '@angular/common';
import { PostService } from '../../shared/services/post.service';
import { environment } from '../../../environments/environment';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { PostType } from '../../shared/models/post-types.enum';
import { appConstants } from '../../shared/constants/app_constants';
import { isNullOrUndefined } from 'util';
import { merge } from 'lodash';
@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
  providers: [AppointmentService]
})
export class AddPostComponent implements OnInit, AfterViewInit {

  // HIDE SHOW SIDEBAR
  public show:boolean = true;
  public buttonName:any = 'Hide';
  toggleDisplay() {
    this.show = !this.show;
    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)  
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }

  s3Bucket = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;
  postForm: FormGroup;

  editPostDetails: Post;
  postTitle;

  postTypeEnum = PostType;

  // Appointment
  public slotList = [];
  public slotDateTime = [];
  public selectedDate: string;
  public displayDate = '';
  public alreadyBookedSlots = [];

  /** When a user tries to tie a post with this post */
  postFromRoute: Post;

  @Input() postType = '';
  @Input() postId: string;

  get createdBy() {
    return this.postForm.get('createdBy');
  }

  get idFromControl() {
    return this.postForm.get('_id');
  }

  get descriptionFormControl() {
    return this.postForm.get('description');
  }

  get statusFormControl() {
    return this.postForm.get('status');
  }

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;

  subscription$ = new Subscription();

  anonymousAvatar = '../../../../assets/images/anonymous-avatar.jpg';
  s3FilesBucketURL = environment.s3FilesBucketURL;

  booked = false;

  /** Feature Variables */
  useCalendar: boolean;
  useFormIo: boolean;
  formDetails: FormGroup;
  selectedPostTypeDetails = null;
  public form = { components: [] };
  formStructureJSON = null;
  formPostType = ['survey'];

  constructor(
    public authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private location: Location,
    private _appointmentService: AppointmentService,
    private router: Router,
    @Inject(PLATFORM_ID) private _platformId,
  ) {

    this.postType = this.activatedRoute.snapshot.queryParams.type;

    if (this.postType) {
      this.selectedPostTypeDetails = appConstants.postTypesArray.find((p) => this.postType === p.name);
    }

    this.postId = this.activatedRoute.snapshot.params.postId;

    /** Make the Changes here while creating new post type */
    this.breadcumb = {
      title: `Add ${this.postType}`,
      path: [
        {
          name: this.postType
        }
      ]
    };

    this.postFormInitialization(null);

    if (!this._appointmentService.subsVar) {
      this._appointmentService.subsVar = this._appointmentService.
        invokeAppointmentDateTime.subscribe(async (date: any) => {
          this.selectedDate = date;
          this.displayDate = moment(this.selectedDate).format('YYYY-MM-DD');
          this.slotDateTime = [];
          await this.getAlreadyBookedSlots(moment(this.selectedDate).format('YYYY-MM-DD'));
        });
    }
  }

  ngAfterViewInit(): void {
    if (this.descriptionEditor && this.descriptionEditor.ckEditorRef) {
      // this.descriptionEditor.ckEditorRef.editorElement.style.minHeight = '50vh';
      // this.descriptionEditor.ckEditorRef.editorElement.style.maxHeight = '50vh';
    }
  }

  ngOnInit() {
    if (this.postId) {
      this.subscription$.add(
        this.postService.getPostById(this.postId).subscribe((p) => {
          this.editPostDetails = p;
          this.postTitle = p.name;
          this.postType = p.type;
          this.selectedPostTypeDetails = appConstants.postTypesArray.find((p) => this.postType === p.name);
          this.breadcumb.title = this.postType;
          this.breadcumb.path[0].name = this.postType;
          this.postFormInitialization(p);
        })
      );
    }

    this.subscription$.add(
      this.postService.saveOrSubmitPost.subscribe(s => {
        if (s && this.postForm && this.postForm.valid) {
          this.submit(s);
        }
      })
    );
  }

  redirectToAddPost(postType) {
    this.router.navigate(['./post/add-post'], { queryParams: { type: postType } });
  }

  postFormInitialization(i: Post) {
    this.postForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : 'Untitled Document', Validators.required),
      price: new FormControl(i && !isNullOrUndefined(i.price) ? i.price : null),
      descriptionHTML: new FormControl(i && i.descriptionHTML ? i.descriptionHTML : ''),
      tags: new FormControl(i && i.tags ? i.tags : []),
      companies: new FormControl(i && i.companies ? i.companies : []),
      clients: new FormControl(i && i.clients ? i.clients : []),
      collaborators: new FormControl(i && i.collaborators ? i.collaborators : []),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      type: new FormControl(i && i.type ? i.type : this.postType),
    });

    if (this.postId || (i && i._id)) {
      this.postForm.addControl('_id', new FormControl(i && i._id ? i._id : ''));
    }

    /** Add FormControls(Fields) specific to the post types */
    switch (this.postType) {

      case PostType.Appointment:
        this.useCalendar = true;
        break;

      case PostType.Survey:
        this.useFormIo = true;
        this.postForm.addControl('formStructureJSON', new FormControl(i && i.formStructureJSON ? i.formStructureJSON : ''));
        break;

      case PostType.Mentor:
        this.useCalendar = true;
        break;

      case PostType.Job:
        this.postForm.addControl('job', new FormGroup({
          jobProfile: new FormControl(i && i.job && i.job.jobProfile ? i.job.jobProfile : [])
        }));
        break;
    }


    /** If somebody tries to tie a post with this post */
    this.postFromRoute = (this.location.getState() as any).post;

    if (this.postFromRoute) {
      this.postForm.get('tags').setValue(this.postFromRoute.tags);
      this.postForm.get('collaborators').setValue(this.postFromRoute.collaborators);
      this.postForm.get('companies').setValue(this.postFromRoute.companies);

      this.postForm.addControl('connectedPosts', new FormControl([this.postFromRoute._id]));
    }
  }


  async submit(status, descriptionEditor?: EditorComponent) {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    this.postForm.get('descriptionHTML').setValue(this.descriptionEditor.html);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    /** Set value of fromJsonStructure */
    if (this.postType === 'survey') {
      this.postForm.get('formStructureJSON').setValue(this.formStructureJSON);
    }

    const postFormValue = { ...this.postForm.value };
    postFormValue.status = status;

    /** Set Values Based On the Post Type Before Submitting the Post */
    this.setValuesBeforeSubmit(postFormValue);


    if (this.postId) {
      this.store.dispatch(UpdatePost({
        post: postFormValue, updatedBy: { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id },
      }));
    } else {
      this.store.dispatch(AddPost({ post: postFormValue }));
    }
  }

  /** Set Values Based On the Post Type Before Adding Post */
  setValuesBeforeSubmit(postFormValue) {
    if (this.useCalendar) {
      postFormValue = merge(
        postFormValue, {
        booking: {
          availabilityDate: moment(this.selectedDate).format('YYYY-MM-DD'),
          duration: this.slotDateTime
        }
      });
    }
  }

  cancelClicked() {
    this.location.back();
  }

  recieveEvent(event) {
    this.postForm.controls.tags.setValue(event.tags);
    this.postForm.controls.companies.setValue(event.companies);
    this.postForm.controls.clients.setValue(event.clients);
    this.postForm.controls.collaborators.setValue(event.collaborators);
    this.postForm.controls.name.setValue(event.name);
  }

  intervals() {
    const start = moment('00:00', 'hh:mm a');
    const end = moment('23:45', 'hh:mm a');
    start.minutes(Math.ceil(start.minutes() / 30) * 30);
    const result = [];
    const current = moment(start);
    while (current <= end) {
      result.push(current.format('HH:mm'));
      current.add(15, 'minutes');
    }

    if (moment(this.selectedDate).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      const currentHour = moment().add('minutes', 0).format('HH');
      const currentMinute = moment().add('minutes', 0).format('mm');
      const filteredSlots = [];
      for (const i of result) {
        if (i.split(':')[0] > currentHour) {
          filteredSlots.push(i);
        } else if (i.split(':')[0] === currentHour && i.split(':')[1] > currentMinute) {
          filteredSlots.push(i);
        }
      }

      this.slotList = [...filteredSlots];
    } else {
      this.slotList = [...result];
    }
  }

  selectedSlot(slot: string) {
    if (this.slotDateTime.length < 2) {
      this.slotDateTime.push(slot);
      const addDate = this.selectedDate.split('T');
      this.formateDateTime(addDate[0], this.slotDateTime);
    } else {
      this.slotDateTime = [];
      this.slotDateTime.push(slot);
    }
  }

  formateDateTime(date: string, timeSlots) {
    this.displayDate = date;
    if (timeSlots.length === 2) {
      if (moment(date + ' ' + timeSlots[0]) < moment(date + ' ' + timeSlots[1])) {
        this.displayDate = date + ' ' + moment(date + ' ' + timeSlots[0]).format('hh:mm A') + ' - ' + moment(date + ' ' + timeSlots[1]).format('hh:mm A')
      } else {
        this.slotDateTime = [];
        alert('FROM time can not greater than TO time slot. Please select again');
      }
    }
  }

  getAlreadyBookedSlots(date: string) {
    this.intervals();
    this.postService.getAlreadyBookedSlots(date).subscribe((data) => {
      this.alreadyBookedSlots = [];
      if (data.appointment.length > 0) {
        data.appointment.map((slot) => {
          this.getBookedSlot(slot.duration[0], slot.duration[1]);
        })
        console.log(this.alreadyBookedSlots);
        this.slotList = this.slotList.filter((slot) => !this.alreadyBookedSlots.includes(slot));
        console.log(this.slotList);
      }
    });
  }

  getBookedSlot(from: string, to: string) {
    const start = moment(from, 'hh:mm a');
    const end = moment(to, 'hh:mm a');
    start.minutes(Math.ceil(start.minutes() / 30) * 30);
    const result = [];
    const current = moment(start);
    while (current <= end) {
      result.push(current.format('HH:mm'));
      current.add(15, 'minutes');
    }
    if (this.alreadyBookedSlots.length === 0) {
      this.alreadyBookedSlots = result;
    } else {
      this.alreadyBookedSlots = [...this.alreadyBookedSlots, ...result];
    }
  }

  isBrowser() {
    return isPlatformBrowser(this._platformId);
  }

  onChange(event) {
    this.formStructureJSON = event.form;
  }

  setPrice(event) {
    this.postForm.get('price').setValue((+event.target.value).toFixed(2));
  }
}
