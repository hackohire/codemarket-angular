import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { EventTypes } from 'src/app/shared/models/event.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subscription, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, startWith, map } from 'rxjs/operators';
import { FormService } from 'src/app/shared/services/form.service';
import { Tag } from 'src/app/shared/models/product.model';
import { MatAutocomplete, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';
import { PostType } from 'src/app/shared/models/post-types.enum';
import { SetSelectedPost, GetPostById, AddPost, UpdatePost } from 'src/app/core/store/actions/post.actions';
import { selectSelectedPost } from 'src/app/core/store/selectors/post.selectors';
// import { LocationService } from '../../shared/services/location.service';
import { Company } from '../../shared/models/company.model';
import { CompanyService } from '../../companies/company.service';
import { isPlatformBrowser } from '@angular/common';
import { PostService } from '../../shared/services/post.service';
import { SweetalertService } from '../../shared/services/sweetalert.service';
import { EditorComponent } from '../../shared/components/editor/editor.component';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  providers: [CompanyService]
})
export class AddEventComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  breadcumb: BreadCumb;
  eventForm: FormGroup;

  eventType: string;

  get createdBy() {
    return this.eventForm.get('createdBy');
  }

  get idFromControl() {
    return this.eventForm.get('_id');
  }

  get descriptionFormControl() {
    return this.eventForm.get('description');
  }

  // get supportDescriptionFormControl() {
  //   return this.eventForm.get('support').get('description');
  // }

  get tagsFormControl() {
    return this.eventForm.get('tags') as FormArray;
  }

  get statusFormControl() {
    return this.eventForm.get('status');
  }

  get locationFormGroup() {
    return this.eventForm.get('location');
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  subscription$: Subscription;

  searchText = new FormControl();
  tagSuggestions: Tag[];
  allTags: Tag[];

  allCompanies: Company[];

  eventTypes = Object.values(EventTypes);

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;

  public dialogRef = null;
  public data;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private formService: FormService,
    private companyService: CompanyService,
    private postService: PostService,
    private sweetAlertService: SweetalertService,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private injector: Injector,
  ) {

    this.dialogRef = this.injector.get(MatDialogRef, null);
    this.data = this.injector.get(MAT_DIALOG_DATA, null);

    this.breadcumb = {
      title: 'Add Event Details',
      path: [

        {
          name: 'Add Event'
        }
      ]
    };

    /** If it is "add-event" route intialize empty event form, but we are setting store property of "Selectedevent" as null
     * and if it is "edit-event route" we need to subscribe to get "Selectedevent" and user refresh the tab,
     * there won't be any selected event,
     * so we need to make the call to
     * get the event by fetching id from the params
     */

    if (this.activatedRoute && this.activatedRoute.snapshot && this.activatedRoute.snapshot.parent && this.activatedRoute.snapshot.parent.routeConfig.path === 'add-event') {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.eventFormInitialization(null);

    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h) => {
          this.eventFormInitialization(h);
        }),
        switchMap((h) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ eventId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected event, so we need to make the call to
           * get the event by fetching id from the params
           */
          if (params.eventId) {
            this.store.dispatch(GetPostById({ postId: params.eventId }));
          }
        })
      ).subscribe();
    }

    // this.eventFormInitialization();
  }

  ngOnInit() {
    // this.locationService.setLocaionSearhAutoComplete(this.searchLocation, this.locationFormGroup);
  }

  async eventFormInitialization(i) {
    this.eventForm = await new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : ''),
      price: new FormControl(i && i.price ? i.price : 0, Validators.required),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      categories: new FormControl(i && i.categories ? i.categories : []),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      tags: this.fb.array(i && i.tags && i.tags.length ? i.tags : []),
      type: new FormControl(PostType.Event),
      // support: new FormGroup({
      //   time: new FormControl(i && i.support && i.support.time ? i.support.time : 0),
      //   description: new FormControl(i && i.support && i.support.description ? i.support.description : '')
      // }),
      membershipRequired: new FormControl(i && i.membershipRequired ? true : false),
      dateRange: new FormControl(i && i.dateRange ? i.dateRange : '', Validators.required),
      location: new FormGroup({
        address: new FormControl(i && i.location ? i.location.address : ''),
      }),
      company: new FormControl(i && i.company ? i.company : '', this.data && this.data.companyDetails ? Validators.required : null),
      eventType: new FormControl(i && i.eventType ? i.eventType : '', Validators.required)
      // address: new FormControl(i && i.address ? i.address : '', Validators.required),
      // snippets: new FormControl(null),
    });

    this.companyService.getCompaniesByType('').subscribe((companies) => {
      this.allCompanies = companies;

      if (this.data && this.data.company) {
        const companyFormControl = this.eventForm.get('company');
        companyFormControl.setValue(this.data.company);
        // companyFormControl.disable();
      }
    });

  }

  async submit(status) {

    if (!this.authService.loggedInUser) {
      this.authService.checkIfUserIsLoggedIn(true);
      return;
    }

    this.statusFormControl.setValue(status);

    const blocks = await this.descriptionEditor.editor.save();
    this.descriptionFormControl.setValue(blocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.eventForm.removeControl('_id');
      const eventFormValue = { ...this.eventForm.value };

      if (this.data && this.data.company) {
        this.postService.addPost(eventFormValue).subscribe((post) => {
          this.sweetAlertService.success(`${post.type} has been ${post.status} Successfully`, '', 'success');
          this.dialogRef.close(post);
        });
      } else {
        this.store.dispatch(AddPost({ post: eventFormValue }));
      }
    } else {
      const eventFormValue = { ...this.eventForm.value };

      /** Only Send _id */
      eventFormValue.company = eventFormValue.company && eventFormValue.company._id ? eventFormValue.company._id : eventFormValue.company;
      this.store.dispatch(UpdatePost({ post: eventFormValue }));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.eventForm.get('description').setValue(event);
  }

  // updateSupportDescription(event) {
  //   this.supportDescriptionFormControl.setValue(event);
  // }

}
