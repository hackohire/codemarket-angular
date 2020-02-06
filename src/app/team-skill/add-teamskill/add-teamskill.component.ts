import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, Subscription } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AddPost, GetPostById, SetSelectedPost, UpdatePost } from '../../core/store/actions/post.actions';
import { selectSelectedPost } from '../../core/store/selectors/post.selectors';
import { AppState } from '../../core/store/state/app.state';
import { BreadCumb } from '../../shared/models/bredcumb.model';
import { Post } from '../../shared/models/post.model';
import { PostType } from '../../shared/models/post-types.enum';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { Tag } from '../../shared/models/product.model';
import { FormService } from '../../shared/services/form.service';
import { EditorComponent } from '../../shared/components/editor/editor.component';




@Component({
  selector: 'app-add-teamskill',
  templateUrl: './add-teamskill.component.html',
  styleUrls: ['./add-teamskill.component.scss']
})
export class AddTeamskillComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  teamskillForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  edit: boolean;

  get createdBy() {
    return this.teamskillForm.get('createdBy');
  }

  get idFromControl() {
    return this.teamskillForm.get('_id');
  }

  get descriptionFormControl() {
    return this.teamskillForm.get('description');
  }

  get supportDescriptionFormControl() {
    return this.teamskillForm.get('support').get('description');
  }

  get tagsFormControl() {
    return this.teamskillForm.get('tags') as FormArray;
  }

  get statusFormControl() {
    return this.teamskillForm.get('status');
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
      title: 'Add Teamskill Details',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Teamskill'
        }
      ]
    };

    /** If it is "add-teamskill" route intialize empty teamskill form, but we are setting store property of "Selectedteamskill" as null
     * and if it is "edit-teamskill route" we need to subscribe to get "Selectedteamskill" and user refresh the tab,
     * there won't be any selected teamskill,
     * so we need to make the call to
     * get the teamskill by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-teamskill') {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.teamskillFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Post) => {
          this.teamskillFormInitialization(h);
          this.edit = true;
        }),
        switchMap((h: Post) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ teamskillId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected teamskill, so we need to make the call to
           * get the teamskill by fetching id from the params
           */
          if (params.teamskillId) {
            this.store.dispatch(GetPostById({ postId: params.teamskillId }));
          }
        })
      ).subscribe();
    }

    // this.teamskillFormInitialization();
  }

  ngOnInit() {
  }

  teamskillFormInitialization(i: Post) {
    this.teamskillForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : ''),
      price: new FormControl(i && i.price ? i.price : 0, Validators.required),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      tags: this.fb.array(i && i.tags && i.tags.length ? i.tags : []),
      type: new FormControl(PostType.Teamskill),
      support: new FormGroup({
        time: new FormControl(i && i.support && i.support.time ? i.support.time : 0),
        description: new FormControl(i && i.support && i.support.description ? i.support.description : '')
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

    const supportBlocks =  await this.supportDescriptionEditor.editor.save();
    this.supportDescriptionFormControl.setValue(supportBlocks.blocks);

    const blocks =  await this.descriptionEditor.editor.save();
    this.descriptionFormControl.setValue(blocks.blocks);

    if (this.authService.loggedInUser && !this.createdBy.value) {
      this.createdBy.setValue(this.authService.loggedInUser._id);
    }

    if (this.idFromControl && !this.idFromControl.value) {
      this.teamskillForm.removeControl('_id');
      this.store.dispatch(AddPost({post: this.teamskillForm.value}));
    } else {
      this.store.dispatch(UpdatePost({post: this.teamskillForm.value}));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.teamskillForm.get('description').setValue(event);
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
