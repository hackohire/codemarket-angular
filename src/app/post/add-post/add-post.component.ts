import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, AfterViewInit, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { AuthService } from '../../core/services/auth.service';
import { AddPost, UpdatePost } from '../../core/store/actions/post.actions';
import { AppState } from '../../core/store/state/app.state';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { EditorComponent } from '../../shared/components/editor/editor.component';
import { Post } from '../../shared/models/post.model';
import { Location } from '@angular/common';
import { PostService } from '../../shared/services/post.service';
import { environment } from '../../../environments/environment';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import { PostType } from '../../shared/models/post-types.enum';
@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss'],
})
export class AddPostComponent implements OnInit, AfterViewInit {

  s3Bucket = environment.s3FilesBucketURL;

  breadcumb: BreadCumb;
  postForm: FormGroup;

  editPostDetails: Post;
  postTitle;

  // Appointment
  public slotList = [];
  public slotDateTime: any;
  public appointmentForm: FormGroup;
  public selectedDate: string;
  public displayDate: string = "";

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


  constructor(
    public authService: AuthService,
    private store: Store<AppState>,
    private activatedRoute: ActivatedRoute,
    private postService: PostService,
    private location: Location,
    private _appointmentService: AppointmentService,
    private router: Router,
    private ngZone: NgZone
  ) {

    this.postType = this.activatedRoute.snapshot.queryParams.type;
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

    if (this._appointmentService.subsVar == undefined) {
      this._appointmentService.subsVar = this._appointmentService.
        invokeAppointmentDateTime.subscribe((date: any) => {
          this.selectedDate = date;
          this.intervals();
        });
    }
  }

  ngAfterViewInit(): void {
    if (this.descriptionEditor && this.descriptionEditor.ckEditorRef) {
      // console.log(this.descriptionEditor.ckEditorRef.elementRef.nativeElement);
      // this.descriptionEditor.ckEditorRef.editorElement.style.minHeight = '50vh';
      // this.descriptionEditor.ckEditorRef.editorElement.style.maxHeight = '50vh';
      // this.des
    }
  }

  ngOnInit() {
    if (this.postId) {
      this.subscription$.add(
        this.postService.getPostById(this.postId).subscribe((p) => {
          this.editPostDetails = p;
          this.postTitle = p.name;
          this.postType = p.type;
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

    if (this.postType === PostType.Appointment) {
      this.postForm.addControl('cancelReason', new FormControl(i && i.cancelReason ? i.cancelReason : ''));
    }


    /** If somebody tries to tie a post with this post */
    this.postFromRoute = (this.location.getState() as any).post;

    if (this.postFromRoute) {
      this.postForm.get('tags').setValue(this.postFromRoute.tags);
      this.postForm.get('collaborators').setValue(this.postFromRoute.collaborators);
      this.postForm.get('companies').setValue(this.postFromRoute.companies);

      this.postForm.addControl('connectedPosts', new FormControl([this.postFromRoute._id]));
    }

    if (i && !i.descriptionHTML && i.description.length) {
      // this.postForm.get('descriptionHTML').setValue(this.descriptionEditor.editorUI);
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


    const postFormValue = { ...this.postForm.value };
    postFormValue.status = status;
    // postFormValue.companies = postFormValue.companies.map(c => c._id);
    if (this.postType === PostType.Appointment) {
      postFormValue.appointment_date = moment(this.displayDate).format('YYYY-MM-DD HH:mm:ss');
    }

    if (this.postId) {
      this.store.dispatch(UpdatePost({
        post: postFormValue, updatedBy: { name: this.authService.loggedInUser.name, _id: this.authService.loggedInUser._id },
      }));
    } else {
      this.store.dispatch(AddPost({ post: postFormValue }));
    }
  }

  cancelClicked() {
    this.location.back();
  }

  uploadImage(a, b, c) {
    console.log(a, b, c);
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
      for (let i = 0; i < result.length; i++) {
        if (result[i].split(':')[0] > currentHour) {
          filteredSlots.push(result[i]);
        } else if (result[i].split(':')[0] === currentHour && result[i].split(':')[1] > currentMinute) {
          filteredSlots.push(result[i]);
        }
      }

      // this.ngZone.run( () => {
      this.slotList = filteredSlots
      console.log(this.slotList);
      // this.testEmitter$.next(this.slotList);
      //  });
    } else {
      // this.ngZone.run( () => {
      this.slotList = result
      console.log(this.slotList);
      // this.testEmitter$.next(this.slotList);
      //  });
    }
  }

  selectedSlot(slot: string) {
    this.slotDateTime = slot;
    const addTime = this.selectedDate.split('T');
    this.displayDate = moment(addTime[0] + ' ' + this.slotDateTime).format('YYYY-MM-DD HH:mm:ss');
  }

  confirmAppointment() {
    console.log(this.appointmentForm.value);
    console.log(this.selectedDate);
    console.log(this.slotDateTime);
  }

}
