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
import { LocationService } from '../../shared/services/location.service';
import { Company } from '../../shared/models/company.model';
import { CompanyService } from '../../companies/company.service';
import { isPlatformBrowser } from '@angular/common';
import { PostService } from '../../shared/services/post.service';
import { SweetalertService } from '../../shared/services/sweetalert.service';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  providers: [CompanyService]
})
export class AddEventComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  eventForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };
  eventType: string;

  edit = false;

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

  /** Location Variables */
  zoom: number = 15;
  @ViewChild('searchLocation', { static: true }) public searchLocation: ElementRef;

  @ViewChild('searchInput', { static: false }) searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  public dialogRef = null;
  public data;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private formService: FormService,
    public locationService: LocationService,
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
          name: 'Dashboard',
          pathString: '/'
        },
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
          this.edit = true;
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
        latitude: new FormControl(i && i.location ? i.location.latitude : 0),
        longitude: new FormControl(i && i.location ? i.location.longitude : 0),
        address: new FormControl(i && i.location ? i.location.address : ''),
      }),
      company: new FormControl(i && i.company ? i.company._id : '', this.data && this.data.companyDetails ? Validators.required : []),
      eventType: new FormControl(i && i.eventType ? i.eventType : '', Validators.required)
      // address: new FormControl(i && i.address ? i.address : '', Validators.required),
      // snippets: new FormControl(null),
    });

    this.locationService.setLocaionSearhAutoComplete(this.searchLocation, this.locationFormGroup);

    this.companyService.getCompaniesByType('').subscribe((companies) => {
      this.allCompanies = companies;

      if (this.data && this.data.company) {
        const companyFormControl = this.eventForm.get('company');
        companyFormControl.setValue(this.data.company._id);
        // companyFormControl.disable();
      }
    });

    this.formService.findFromCollection('', 'tags').subscribe((tags) => {
      this.tagSuggestions = tags;
      this.allTags = tags;
    });

    this.searchText.valueChanges.pipe(
      startWith(''),
      map((text) => text ? this._filter(text) : this.allTags && this.allTags.length ? this.allTags.slice() : []))
      .subscribe((tags) => this.tagSuggestions = tags);


    if (isPlatformBrowser(this._platformId)) {
      const routerStateData = window.history.state
      if (routerStateData && routerStateData.companyDetails) {
        if (routerStateData.companyDetails.location) {
          this.locationFormGroup.get('longitude').setValue(routerStateData.companyDetails.location.longitude);
          this.locationFormGroup.get('latitude').setValue(routerStateData.companyDetails.location.latitude);
          this.locationFormGroup.get('address').setValue(routerStateData.companyDetails.location.address);
        }

        if (routerStateData.companyDetails._id) {
          this.eventForm.get('company').setValue(routerStateData.companyDetails._id)
        }
      }
    }

  }

  private _filter(value): Tag[] {
    const filterValue = value && value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.allTags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0);
  }

  submit(status) {

    this.statusFormControl.setValue(status);

    // if (!this.supportDescriptionFormControl.value) {
    //   this.supportDescriptionFormControl.setValue([]);
    // }

    if (!this.descriptionFormControl.value) {
      this.descriptionFormControl.setValue([]);
    }

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.eventForm.removeControl('_id');

      if (this.data && this.data.company) {
        this.postService.addPost(this.eventForm.value).subscribe((post) => {
          this.sweetAlertService.success(`${post.type} has been ${post.status} Successfully`, '', 'success');
          this.dialogRef.close(post);
        });
      } else {
        this.store.dispatch(AddPost({ post: this.eventForm.value }));
      }
    } else {
      this.store.dispatch(UpdatePost({ post: this.eventForm.value }));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.eventForm.get('description').setValue(event);
  }

  // updateSupportDescription(event) {
  //   this.supportDescriptionFormControl.setValue(event);
  // }

  addTech(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const availableTag = this.tagSuggestions.find((t) => t.name.toLowerCase() == event.value.trim().toLowerCase());
      const formAvailableInTafsFormControl = this.tagsFormControl.value.find((t) => t.name.toLowerCase() == event.value.trim().toLowerCase());
      if (formAvailableInTafsFormControl && event && event.input && event.input.value) {
        event.input.value = '';
      } else if (availableTag) {
        this.tagsFormControl.push(new FormControl({ name: availableTag.name, _id: availableTag._id }));
      } else {
        this.formService.addCategory(this.tagsFormControl, event);
      }
      // this.tagSuggestions = this.tagSuggestions.filter((t) => t.name.toLowerCase() !== event.value.trim().toLowerCase())
      this.searchText.setValue(null);
    }
  }

  selected(event) {
    // this.tagSuggestions = this.tagSuggestions.filter((t) => t._id !== event.option.value._id)
    const formAvailableInTafsFormControl = this.tagsFormControl.value.find((t) => t.name.toLowerCase() == event.option.value.name.trim().toLowerCase());
    if (formAvailableInTafsFormControl) {
      event.input.value = '';
    } else {
      this.formService.selectedCategory(this.tagsFormControl, event);
    }
    this.searchInput.nativeElement.value = null;
    this.searchText.setValue(null);
  }


  // Remove a Tag
  public remove(index: number): void {
    this.formService.removeCategory(this.tagsFormControl, index);
  }
}
