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
import { Goal } from '../../shared/models/goal.model';
import { PostType } from '../../shared/models/post-types.enum';
import { PostStatus } from '../../shared/models/poststatus.enum';
import { Tag } from '../../shared/models/product.model';
import { FormService } from '../../shared/services/form.service';
;



@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})
export class AddGoalComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  urlRegex = '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$';
  breadcumb: BreadCumb;
  goalForm: FormGroup;
  modules = {
    formula: true,
    syntax: true,
  };

  edit: boolean;

  get createdBy() {
    return this.goalForm.get('createdBy');
  }

  get idFromControl() {
    return this.goalForm.get('_id');
  }

  get descriptionFormControl() {
    return this.goalForm.get('description');
  }

  get supportDescriptionFormControl() {
    return this.goalForm.get('support').get('description');
  }

  get tagsFormControl() {
    return this.goalForm.get('tags') as FormArray;
  }

  get statusFormControl() {
    return this.goalForm.get('status');
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
      title: 'Add Goal Details',
      path: [
        {
          name: 'Dashboard',
          pathString: '/'
        },
        {
          name: 'Add Goal'
        }
      ]
    };

    /** If it is "add-goal" route intialize empty goal form, but we are setting store property of "Selectedgoal" as null
     * and if it is "edit-goal route" we need to subscribe to get "Selectedgoal" and user refresh the tab,
     * there won't be any selected goal,
     * so we need to make the call to
     * get the goal by fetching id from the params
     */

    if (this.activatedRoute.snapshot.parent.routeConfig.path === 'add-goal') {
      this.store.dispatch(SetSelectedPost({ post: null }));
      this.goalFormInitialization(null);
    } else {
      this.subscription$ = this.store.select(selectSelectedPost).pipe(
        tap((h: Goal) => {
          this.goalFormInitialization(h);
          this.edit = true;
        }),
        switchMap((h: Goal) => {
          if (!h) {
            return this.activatedRoute.params;
          }
          return of({ goalId: '' });
        }),
        tap((params) => {
          /** When user refresh the tab, there won't be any selected goal, so we need to make the call to
           * get the goal by fetching id from the params
           */
          if (params.goalId) {
            this.store.dispatch(GetPostById({ postId: params.goalId }));
          }
        })
      ).subscribe();
    }

    // this.goalFormInitialization();
  }

  ngOnInit() {
  }

  goalFormInitialization(i: Goal) {
    this.goalForm = new FormGroup({
      name: new FormControl(i && i.name ? i.name : '', Validators.required),
      description: new FormControl(i && i.description ? i.description : ''),
      price: new FormControl(i && i.price ? i.price : 0, Validators.required),
      createdBy: new FormControl(i && i.createdBy && i.createdBy._id ? i.createdBy._id : ''),
      categories: new FormControl(i && i.categories ? i.categories : []),
      status: new FormControl(i && i.status ? i.status : PostStatus.Drafted),
      _id: new FormControl(i && i._id ? i._id : ''),
      tags: this.fb.array(i && i.tags && i.tags.length ? i.tags : []),
      type: new FormControl(PostType.Goal),
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
      this.goalForm.removeControl('_id');
      this.store.dispatch(AddPost({post: this.goalForm.value}));
    } else {
      this.store.dispatch(UpdatePost({post: this.goalForm.value}));
    }
  }

  updateFormData(event) {
    console.log(event);
    this.goalForm.get('description').setValue(event);
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
