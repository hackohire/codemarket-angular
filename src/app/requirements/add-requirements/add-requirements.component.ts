import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreadCumb } from 'src/app/shared/models/bredcumb.model';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Requirement } from 'src/app/shared/models/requirement.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/core/store/state/app.state';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, startWith, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { FormService } from 'src/app/shared/services/form.service';
import { Tag } from 'src/app/shared/models/product.model';
import { MatAutocomplete } from '@angular/material';
import { PostStatus } from 'src/app/shared/models/poststatus.enum';
import { PostType } from 'src/app/shared/models/post-types.enum';
import { SetSelectedPost, GetPostById, AddPost, UpdatePost } from 'src/app/core/store/actions/post.actions';
import { selectSelectedPost } from 'src/app/core/store/selectors/post.selectors';
import { EditorComponent } from '../../shared/components/editor/editor.component';

@Component({
  selector: 'app-add-requirements',
  templateUrl: './add-requirements.component.html',
  styleUrls: ['./add-requirements.component.scss']
})
export class AddRequirementsComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  requirementForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  edit: boolean;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  subscription$: Subscription;

  get createdBy() {
    return this.requirementForm.get('createdBy');
  }

  get idFromControl() {
    return this.requirementForm.get('_id');
  }

  get descriptionFormControl() {
    return this.requirementForm.get('description');
  }

  get supportDescriptionFormControl() {
    return this.requirementForm.get('support').get('description');
  }

  get tagsFormControl() {
    return this.requirementForm.get('tags') as FormArray;
  }

  get statusFormControl() {
    return this.requirementForm.get('status');
  }

  searchText = new FormControl();
  tagSuggestions: Tag[];
  allTags: Tag[];

  @ViewChild('searchInput', {static: false}) searchInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  @ViewChild('descriptionEditor', { static: false }) descriptionEditor: EditorComponent;
  @ViewChild('supportDescriptionEditor', { static: false }) supportDescriptionEditor: EditorComponent;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private formService: FormService
  ) {
    this.breadcumb = {
      title: 'Add Requirement Details',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Requirements'
        }
      ]
    };

    /** If it is "add-requirement" route intialize empty requirement form, but we are setting store property of "Selectedrequirement" as null
     * and if it is "edit-requirement route" we need to subscribe to get "Selectedrequirement" and user refresh the tab,
     * there won't be any selected requirement,
     * so we need to make the call to
     * get the requirement by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-requirement') {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.requirementFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Requirement) => {
          this.requirementFormInitialization(h);
          this.edit = true;
        }),
        switchMap((h: Requirement) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ requirementId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected requirement, so we need to make the call to
           * get the requirement by fetching id from the params
           */
          if (params.requirementId) {
            this.store.dispatch(GetPostById({ postId: params.requirementId }));
          }
        })
      ).subscribe();
    }

    // this.requirementFormInitialization();
  }

  ngOnInit() {
  }

  requirementFormInitialization(r: Requirement) {
    this.requirementForm = new FormGroup({
      name: new FormControl(r && r.name ? r.name : '', Validators.required),
      description: new FormControl(r && r.description ? r.description : []),
      price: new FormControl(r && r.price ? r.price : 0, Validators.required),
      createdBy: new FormControl(r && r.createdBy && r.createdBy._id ? r.createdBy._id : ''),
      categories: new FormControl(r && r.categories ? r.categories : []),
      status: new FormControl(r && r.status ? r.status : PostStatus.Drafted),
      _id: new FormControl(r && r._id ? r._id : ''),
      tags: this.fb.array(r && r.tags && r.tags.length ? r.tags : []),
      type: new FormControl(PostType.Requirement),
      support: new FormGroup({
        time: new FormControl(r && r.support && r.support.time ? r.support.time : 0),
        description: new FormControl(r && r.support && r.support.description ? r.support.description : [])
      })
      // snippets: new FormControl(null),
    });

    this.formService.findFromCollection('', 'tags').subscribe((tags) => {
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

  async submit(status) {

    this.statusFormControl.setValue(status);

    const blocks =  await this.descriptionEditor.editor.save();
    this.descriptionFormControl.setValue(blocks.blocks);

    const supportBlocks =  await this.supportDescriptionEditor.editor.save();
    this.supportDescriptionFormControl.setValue(supportBlocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.requirementForm.removeControl('_id');
      this.store.dispatch(AddPost({ post: this.requirementForm.value }));
    } else {
      this.store.dispatch(UpdatePost({post: this.requirementForm.value}));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.requirementForm.get('description').setValue(event);
  }

  updateSupportDescription(event) {
    this.supportDescriptionFormControl.setValue(event);
  }

  addTech(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const availableTag = this.tagSuggestions.find((t) => t.name.toLowerCase() == event.value.trim().toLowerCase());
      const formAvailableInTafsFormControl = this.tagsFormControl.value.find((t) => t.name.toLowerCase() == event.value.trim().toLowerCase());
      if (formAvailableInTafsFormControl && event && event.input && event.input.value) {
        event.input.value = '';
      } else if (availableTag) {
        this.tagsFormControl.push(new FormControl({name: availableTag.name, _id: availableTag._id}));
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
