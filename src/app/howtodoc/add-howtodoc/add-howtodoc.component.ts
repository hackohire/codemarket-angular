import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Howtodoc } from 'src/app/shared/models/howtodoc.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { AddHowtodoc, UpdateHowtodoc, SetSelectedHowtodoc, GetHowtodocById } from 'src/app/core/store/actions/howtodoc.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subscription, of, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { selectSelectedHowtodoc } from 'src/app/core/store/selectors/howtodoc.selectors';
import { switchMap, tap, startWith, map } from 'rxjs/operators';
import { FormService } from 'src/app/shared/services/form.service';
import { Tag } from 'src/app/shared/models/product.model';
import { MatAutocomplete } from '@angular/material';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';


@Component({
  selector: 'app-add-howtodoc',
  templateUrl: './add-howtodoc.component.html',
  styleUrls: ['./add-howtodoc.component.scss']
})
export class AddHowtodocComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  howtodocForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  edit: boolean;

  get createdBy() {
    return this.howtodocForm.get('createdBy');
  }

  get idFromControl() {
    return this.howtodocForm.get('_id');
  }

  get descriptionFormControl() {
    return this.howtodocForm.get('description');
  }

  get supportDescriptionFormControl() {
    return this.howtodocForm.get('support').get('description');
  }

  get tagsFormControl() {
    return this.howtodocForm.get('tags') as FormArray;
  }

  get statusFormControl() {
    return this.howtodocForm.get('status');
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
      title: 'Add How-To-Guide Details',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add How-To-Guide'
        }
      ]
    };

    /** If it is "add-howtodoc" route intialize empty howtodoc form, but we are setting store property of "Selectedhowtodoc" as null
     * and if it is "edit-howtodoc route" we need to subscribe to get "Selectedhowtodoc" and user refresh the tab,
     * there won't be any selected howtodoc,
     * so we need to make the call to
     * get the howtodoc by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-howtodoc') {
      this.store.dispatch(SetSelectedHowtodoc({ howtodoc: null }));
      this.howtodocFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedHowtodoc).pipe(
        tap((h: Howtodoc) => {
          this.howtodocFormInitialization(h);
          this.edit = true;
        }),
        switchMap((h: Howtodoc) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ howtodocId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected howtodoc, so we need to make the call to
           * get the howtodoc by fetching id from the params
           */
          if (params.howtodocId) {
            this.store.dispatch(GetHowtodocById({ howtodocId: params.howtodocId }));
          }
        })
      ).subscribe();
    }

    // this.howtodocFormInitialization();
  }

  ngOnInit() {
  }

  howtodocFormInitialization(i: Howtodoc) {
    this.howtodocForm = new FormGroup({
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
    });

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
      this.howtodocForm.removeControl('_id');
      this.store.dispatch(AddHowtodoc({howtodoc: this.howtodocForm.value}));
    } else {
      this.store.dispatch(UpdateHowtodoc({howtodoc: this.howtodocForm.value}));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.howtodocForm.get('description').setValue(event);
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
