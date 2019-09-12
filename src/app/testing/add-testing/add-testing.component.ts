import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Testing } from 'src/app/shared/models/testing.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { AddTesting, UpdateTesting, SetSelectedTesting, GetTestingById } from 'src/app/core/store/actions/testing.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subscription, of, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { selectSelectedTesting } from 'src/app/core/store/selectors/testing.selectors';
import { switchMap, tap, startWith, map } from 'rxjs/operators';
import { FormService } from 'src/app/shared/services/form.service';
import { Tag } from 'src/app/shared/models/product.model';
import { MatAutocomplete } from '@angular/material';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';


@Component({
  selector: 'app-add-testing',
  templateUrl: './add-testing.component.html',
  styleUrls: ['./add-testing.component.scss']
})
export class AddTestingComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  testingForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  edit: boolean;

  get createdBy() {
    return this.testingForm.get('createdBy');
  }

  get idFromControl() {
    return this.testingForm.get('_id');
  }

  get descriptionFormControl() {
    return this.testingForm.get('description');
  }

  get supportDescriptionFormControl() {
    return this.testingForm.get('support').get('description');
  }

  get tagsFormControl() {
    return this.testingForm.get('tags') as FormArray;
  }

  get statusFormControl() {
    return this.testingForm.get('status');
  }

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  subscription$: Subscription;

  searchText = new FormControl();
  tagSuggestions: Tag[];
  allTags: Tag[];

  @ViewChild('searchInput', {static: false}) searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  
  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private formService: FormService
  ) {
    this.breadcumb = {
      title: 'Add Testing Details',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Testing Report'
        }
      ]
    };

    /** If it is "add-testing" route intialize empty testing form, but we are setting store property of "Selectedtesting" as null
     * and if it is "edit-testing route" we need to subscribe to get "Selectedtesting" and user refresh the tab,
     * there won't be any selected testing,
     * so we need to make the call to
     * get the testing by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-testing') {
      this.store.dispatch(SetSelectedTesting({ testing: null }));
      this.testingFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedTesting).pipe(
        tap((h: Testing) => {
          this.testingFormInitialization(h);
          this.edit = true;
        }),
        switchMap((h: Testing) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ testingId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected testing, so we need to make the call to
           * get the testing by fetching id from the params
           */
          if (params.testingId) {
            this.store.dispatch(GetTestingById({ testingId: params.testingId }));
          }
        })
      ).subscribe();
    }

    // this.testingFormInitialization();
  }

  ngOnInit() {
  }

  testingFormInitialization(i: Testing) {
    this.testingForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : ''),
      price: new FormControl(i && i.price ? i.price : 0, Validators.required),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      // shortDescription: new FormControl(i && i.shortDescription ? i.shortDescription : ''),
      categories: new FormControl(i && i.categories ? i.categories : []),
      // demo_url: new FormControl(i && i.demo_url ? i.demo_url : '', [Validators.pattern(this.urlRegex)]),
      // documentation_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      // video_url: new FormControl('', [Validators.pattern(this.urlRegex)]),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      tags: this.fb.array(i && i.tags && i.tags.length ? i.tags : []),
      support: new FormGroup({
        time: new FormControl(i && i.support && i.support.time ? i.support.time : 0),
        description: new FormControl(i && i.support && i.support.description ? i.support.description : '')
      })
      // snippets: new FormControl(null),
    });

    this.formService.searchCategories('').subscribe((tags) => {
      this.tagSuggestions = tags;
      this.allTags = tags;
    })

    this.searchText.valueChanges.pipe(
      startWith(''),
      map((text) => text ? this._filter(text) : this.allTags && this.allTags.length ? this.allTags.slice() : []))
      .subscribe((tags) => this.tagSuggestions = tags);

  }

  private _filter(value): Tag[] {
    const filterValue = value && value.name ? value.name.toLowerCase() : value.toLowerCase();
    return this.allTags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0);
  }

  submit(status) {

    this.statusFormControl.setValue(status);

    if (!this.supportDescriptionFormControl.value) {
      this.supportDescriptionFormControl.setValue([]);
    }

    if (!this.descriptionFormControl.value) {
      this.descriptionFormControl.setValue([]);
    }

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.testingForm.removeControl('_id');
      this.store.dispatch(AddTesting({testing: this.testingForm.value}));
    } else {
      this.store.dispatch(UpdateTesting({testing: this.testingForm.value}));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.testingForm.get('description').setValue(event);
  }

  updateSupportDescription(event) {
    this.supportDescriptionFormControl.setValue(event);
  }

  addTech(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      this.formService.addCategory(this.tagsFormControl, event);
      this.searchText.setValue(null);
    }
  }

  selected(event) {
    this.formService.selectedCategory(this.tagsFormControl, event);
    this.searchInput.nativeElement.value = null;
    this.searchText.setValue(null);
  }


  // Remove a Tag
  public remove(index: number): void {
    this.formService.removeCategory(this.tagsFormControl, index)
  }
}
